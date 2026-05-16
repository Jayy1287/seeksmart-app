import { createHmac, timingSafeEqual } from "crypto";
import { UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { auth } from "@/auth";

const ADMIN_COOKIE_NAME = "seeksmart_admin_session";
const SESSION_SUBJECT = "seeksmart-admin";
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type AdminSessionPayload = {
  exp: number;
  sub: typeof SESSION_SUBJECT;
};

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD;
}

function getSigningSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
}

function sign(value: string) {
  const secret = getSigningSecret();

  if (!secret) {
    return null;
  }

  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminAuthConfigured() {
  return Boolean(getAdminPassword() && getSigningSecret());
}

export function verifyAdminPassword(password: string) {
  const configuredPassword = getAdminPassword();

  if (!configuredPassword) {
    return false;
  }

  return safeEqual(password, configuredPassword);
}

export async function setAdminSessionCookie() {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SECONDS;
  const payload = Buffer.from(
    JSON.stringify({
      exp: expiresAt,
      sub: SESSION_SUBJECT
    } satisfies AdminSessionPayload)
  ).toString("base64url");
  const signature = sign(payload);

  if (!signature) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS
  });

  return true;
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

async function isLegacyAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!session) {
    return false;
  }

  const [payload, signature] = session.split(".");
  const expectedSignature = payload ? sign(payload) : null;

  if (!payload || !signature || !expectedSignature) {
    return false;
  }

  if (!safeEqual(signature, expectedSignature)) {
    return false;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as Partial<AdminSessionPayload>;

    return (
      parsed.sub === SESSION_SUBJECT &&
      typeof parsed.exp === "number" &&
      parsed.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const session = await auth();

  if (session?.user.role === UserRole.ADMIN) {
    return true;
  }

  return isLegacyAdminAuthenticated();
}
