import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "seeksmart_admin_session";
const SESSION_SUBJECT = "seeksmart-admin";

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
  const signature = sign(SESSION_SUBJECT);

  if (!signature) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, `${SESSION_SUBJECT}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return true;
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const signature = sign(SESSION_SUBJECT);

  if (!signature) {
    return false;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  return session === `${SESSION_SUBJECT}.${signature}`;
}
