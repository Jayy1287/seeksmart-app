import { createHash } from "crypto";
import type { EmailConfig } from "next-auth/providers/email";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { assertRateLimit, getClientIp } from "@/server/http/rate-limit";

const DEFAULT_AUTH_EMAIL_FROM = "SeekSmart <hello@seeksmart.in>";
const DEFAULT_MAGIC_LINK_MAX_AGE_SECONDS = 15 * 60;

export function isEmailAuthConfigured() {
  return Boolean(getEmailFromAddress() && getResendApiKey());
}

export function buildEmailProviderConfig(): Pick<
  EmailConfig,
  "from" | "maxAge" | "normalizeIdentifier" | "sendVerificationRequest"
> {
  return {
    from: getEmailFromAddress(),
    maxAge: DEFAULT_MAGIC_LINK_MAX_AGE_SECONDS,
    normalizeIdentifier(identifier) {
      return normalizeEmail(identifier);
    },
    async sendVerificationRequest(params) {
      const normalizedEmail = normalizeEmail(params.identifier);

      if (!isEmailAuthConfigured()) {
        throw new Error("Passwordless email auth is not configured.");
      }

      if (!allowEmailSignInAttempt(params.request, normalizedEmail)) {
        return;
      }

      const magicLink = params.url;
      const host = new URL(siteConfig.url).host;
      const expiresInMinutes = Math.max(
        1,
        Math.round(
          (params.expires.getTime() - Date.now()) / (60 * 1000)
        )
      );

      await sendResendEmail({
        html: renderMagicLinkHtml({
          expiresInMinutes,
          host,
          magicLink
        }),
        subject: `Your SeekSmart sign-in link`,
        text: renderMagicLinkText({
          expiresInMinutes,
          host,
          magicLink
        }),
        to: normalizedEmail
      });
    }
  };
}

export async function sendWelcomeEmail(email: string) {
  if (!isEmailAuthConfigured()) {
    return;
  }

  const normalizedEmail = normalizeEmail(email);

  await sendResendEmail({
    html: renderWelcomeHtml(),
    subject: "Welcome to SeekSmart",
    text: renderWelcomeText(),
    to: normalizedEmail
  });
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getResendApiKey() {
  return process.env.RESEND_API_KEY?.trim();
}

function getEmailFromAddress() {
  return process.env.AUTH_EMAIL_FROM?.trim() || DEFAULT_AUTH_EMAIL_FROM;
}

function getEmailReplyTo() {
  return process.env.AUTH_EMAIL_REPLY_TO?.trim() || undefined;
}

function allowEmailSignInAttempt(request: Request, email: string) {
  const normalizedEmail = normalizeEmail(email);
  const emailKey = createHash("sha256")
    .update(normalizedEmail)
    .digest("hex")
    .slice(0, 24);

  try {
    assertRateLimit({
      key: `auth-email:${emailKey}`,
      limit: 4,
      windowMs: 15 * 60 * 1000
    });
    assertRateLimit({
      key: `auth-email-ip:${getClientIp(request)}`,
      limit: 12,
      windowMs: 15 * 60 * 1000
    });
    return true;
  } catch {
    return false;
  }
}

async function sendResendEmail({
  html,
  subject,
  text,
  to
}: {
  html: string;
  subject: string;
  text: string;
  to: string;
}) {
  const apiKey = getResendApiKey();

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: getEmailFromAddress(),
      to,
      subject,
      html,
      text,
      reply_to: getEmailReplyTo()
    })
  });

  if (!response.ok) {
    throw new Error(
      `Resend email request failed with status ${response.status}.`
    );
  }
}

function renderMagicLinkHtml({
  expiresInMinutes,
  host,
  magicLink
}: {
  expiresInMinutes: number;
  host: string;
  magicLink: string;
}) {
  return `
    <div style="margin:0;background:#f4f1ea;padding:32px 16px;font-family:'Avenir Next',Inter,system-ui,sans-serif;color:#10233f;">
      <div style="max-width:620px;margin:0 auto;overflow:hidden;border-radius:28px;background:#ffffff;box-shadow:0 28px 80px rgba(16,35,63,0.12);">
        <div style="padding:16px 28px;background:#10233f;color:#f8f4ec;">
          <p style="margin:0;font-size:12px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;">SeekSmart</p>
        </div>
        <div style="padding:36px 28px 18px;background:linear-gradient(180deg,#fbf8ef 0%,#ffffff 100%);">
          <p style="margin:0 0 12px;color:#b46a2f;font-size:12px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;">Secure sign-in</p>
          <h1 style="margin:0 0 14px;font-size:32px;line-height:1.08;color:#10233f;">Open your decision workspace</h1>
          <p style="margin:0;color:rgba(16,35,63,0.76);font-size:16px;line-height:1.75;">
            Use the secure link below to sign in to ${host}. This link expires in ${expiresInMinutes} minutes and can be used only once.
          </p>
        </div>
        <div style="padding:0 28px 32px;">
          <div style="border:1px solid rgba(180,106,47,0.16);border-radius:24px;background:#fffdf7;padding:24px;">
            <a href="${magicLink}" style="display:inline-block;border-radius:999px;background:#10233f;color:#ffffff;font-size:15px;font-weight:700;line-height:1;padding:16px 24px;text-decoration:none;">
              Sign in to SeekSmart
            </a>
            <p style="margin:18px 0 0;color:rgba(16,35,63,0.66);font-size:14px;line-height:1.7;">
              If the button does not open, copy and paste this link into your browser:
            </p>
            <p style="margin:12px 0 0;color:#10233f;font-size:12px;line-height:1.7;word-break:break-word;">
              ${magicLink}
            </p>
          </div>
          <div style="margin-top:22px;border-top:1px solid rgba(16,35,63,0.1);padding-top:18px;">
            <p style="margin:0;color:rgba(16,35,63,0.72);font-size:14px;line-height:1.7;">
              You are receiving this because someone entered your email on SeekSmart.
              If that was not you, you can safely ignore this message.
            </p>
          </div>
          <p style="margin:18px 0 0;color:rgba(16,35,63,0.5);font-size:12px;line-height:1.7;">
            SeekSmart helps teams make calmer, more practical AI buying decisions.
          </p>
        </div>
      </div>
      <p style="max-width:620px;margin:14px auto 0;color:rgba(16,35,63,0.5);font-size:12px;line-height:1.6;text-align:center;">
        Sent from ${absoluteUrl("/")}
      </p>
    </div>
  `.trim();
}

function renderMagicLinkText({
  expiresInMinutes,
  host,
  magicLink
}: {
  expiresInMinutes: number;
  host: string;
  magicLink: string;
}) {
  return [
    `SeekSmart sign-in link`,
    ``,
    `Open this secure link to sign in to ${host}:`,
    magicLink,
    ``,
    `This link expires in ${expiresInMinutes} minutes and can be used only once.`,
    `If you did not request this email, you can safely ignore it.`
  ].join("\n");
}

function renderWelcomeHtml() {
  return `
    <div style="margin:0;background:#f4f1ea;padding:32px 16px;font-family:'Avenir Next',Inter,system-ui,sans-serif;color:#10233f;">
      <div style="max-width:620px;margin:0 auto;overflow:hidden;border-radius:28px;background:#ffffff;box-shadow:0 28px 80px rgba(16,35,63,0.12);">
        <div style="padding:16px 28px;background:#10233f;color:#f8f4ec;">
          <p style="margin:0;font-size:12px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;">SeekSmart</p>
        </div>
        <div style="padding:36px 28px 18px;background:linear-gradient(180deg,#fbf8ef 0%,#ffffff 100%);">
          <p style="margin:0 0 12px;color:#b46a2f;font-size:12px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;">Welcome</p>
          <h1 style="margin:0 0 14px;font-size:32px;line-height:1.08;color:#10233f;">Your AI decision workspace is ready</h1>
          <p style="margin:0;color:rgba(16,35,63,0.76);font-size:16px;line-height:1.75;">
            Thanks for joining SeekSmart. You can now save audit briefs, keep a working shortlist of tools, and return to your decisions with the original context intact.
          </p>
        </div>
        <div style="padding:0 28px 32px;">
          <div style="display:grid;gap:12px;border:1px solid rgba(180,106,47,0.16);border-radius:24px;background:#fffdf7;padding:24px;">
            <p style="margin:0;color:#10233f;font-size:15px;font-weight:700;">What you can do next</p>
            <p style="margin:0;color:rgba(16,35,63,0.72);font-size:14px;line-height:1.7;">Run an audit to get a practical AI brief for your workflow.</p>
            <p style="margin:0;color:rgba(16,35,63,0.72);font-size:14px;line-height:1.7;">Like tools while browsing so your shortlist is waiting in the dashboard.</p>
            <p style="margin:0;color:rgba(16,35,63,0.72);font-size:14px;line-height:1.7;">Reopen saved decisions later without starting from a blank page.</p>
          </div>
          <div style="margin-top:22px;">
            <a href="${absoluteUrl("/dashboard")}" style="display:inline-block;border-radius:999px;background:#10233f;color:#ffffff;font-size:15px;font-weight:700;line-height:1;padding:16px 24px;text-decoration:none;">
              Open dashboard
            </a>
          </div>
          <p style="margin:18px 0 0;color:rgba(16,35,63,0.5);font-size:12px;line-height:1.7;">
            Sent from ${absoluteUrl("/")} by SeekSmart.
          </p>
        </div>
      </div>
    </div>
  `.trim();
}

function renderWelcomeText() {
  return [
    "Welcome to SeekSmart.",
    "",
    "Your account is ready. You can now save audit briefs, keep a shortlist of liked tools, and revisit AI decisions later.",
    "",
    "Open your dashboard:",
    absoluteUrl("/dashboard")
  ].join("\n");
}
