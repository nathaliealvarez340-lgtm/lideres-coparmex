import { createHmac, pbkdf2Sync, timingSafeEqual } from "crypto";

export const adminCookieName = "coparmex_admin_session";

const sessionMaxAgeSeconds = 60 * 60 * 8;

type SessionPayload = {
  exp: number;
  username: string;
};

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME ?? "MD-Coparmex";
}

export function verifyAdminCredentials(username: string, password: string) {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!passwordHash) {
    throw new Error("Missing ADMIN_PASSWORD_HASH");
  }

  return username === getAdminUsername() && verifyPasswordHash(password, passwordHash);
}

export function createAdminSession(username: string) {
  const payload: SessionPayload = {
    exp: Date.now() + sessionMaxAgeSeconds * 1000,
    username,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSession(cookieValue?: string | null) {
  if (!cookieValue) {
    return false;
  }

  const [encodedPayload, signature] = cookieValue.split(".");

  if (!encodedPayload || !signature || sign(encodedPayload) !== signature) {
    return false;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;

    return payload.username === getAdminUsername() && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function expiredAdminCookieOptions() {
  return {
    ...adminCookieOptions(),
    maxAge: 0,
  };
}

export function getSessionFromCookieHeader(cookieHeader: string | null) {
  return cookieHeader
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${adminCookieName}=`))
    ?.slice(adminCookieName.length + 1);
}

function verifyPasswordHash(password: string, storedHash: string) {
  const [algorithm, iterationsValue, salt, hash] = storedHash.split("$");

  if (algorithm !== "pbkdf2-sha256" || !iterationsValue || !salt || !hash) {
    throw new Error("ADMIN_PASSWORD_HASH must use pbkdf2-sha256 format");
  }

  const iterations = Number(iterationsValue);
  const expected = Buffer.from(hash, "base64url");
  const actual = pbkdf2Sync(password, salt, iterations, expected.length, "sha256");

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function sign(value: string) {
  const secret = process.env.ADMIN_PASSWORD_HASH;

  if (!secret) {
    throw new Error("Missing ADMIN_PASSWORD_HASH");
  }

  return createHmac("sha256", secret).update(value).digest("base64url");
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}
