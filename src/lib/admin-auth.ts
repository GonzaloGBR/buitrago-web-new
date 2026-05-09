import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { ADMIN_COOKIE } from "@/lib/admin-constants";

function getSecret(): Uint8Array {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "Configura ADMIN_SESSION_SECRET (mín. 16 caracteres) en .env.local"
    );
  }
  return new TextEncoder().encode(s);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const t = jar.get(ADMIN_COOKIE)?.value;
  if (!t) return false;
  return verifySessionToken(t);
}
