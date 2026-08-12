import { SignJWT, jwtVerify } from "jose";
import { createHash, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "convite_admin_session";

function getAdminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error(
      "ADMIN_PASSWORD não configurada. Defina a variável de ambiente com a senha de administrador."
    );
  }
  return pw;
}

// Deriva uma chave de assinatura estável a partir da senha do admin, para não
// precisar de uma segunda variável de ambiente só para assinar o cookie.
function getSigningKey(): Uint8Array {
  const pw = getAdminPassword();
  const digest = createHash("sha256").update(`convite-session-v1:${pw}`).digest();
  return new Uint8Array(digest);
}

export function checkPassword(candidate: string): boolean {
  const expected = getAdminPassword();
  const a = Buffer.from(candidate.padEnd(256, "\0"));
  const b = Buffer.from(expected.padEnd(256, "\0"));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12h

export async function createSessionToken(): Promise<string> {
  const key = getSigningKey();
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const key = getSigningKey();
    const { payload } = await jwtVerify(token, key);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;
