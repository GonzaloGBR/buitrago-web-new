import { createHash } from "crypto";

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60 * 60 * 1000; // 1 hora
const MAX_PER_WINDOW = 8;
const store = new Map<string, Bucket>();

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export function contactRateLimitKey(ip: string): string {
  return hashIp(ip || "unknown");
}

/** Devuelve true si se debe bloquear la solicitud (demasiados envíos). */
export function isContactRateLimited(ipHash: string): boolean {
  const now = Date.now();
  const b = store.get(ipHash);
  if (!b || now > b.resetAt) {
    store.set(ipHash, { count: 0, resetAt: now + WINDOW_MS });
    return false;
  }
  if (b.count >= MAX_PER_WINDOW) return true;
  return false;
}

export function recordContactSubmission(ipHash: string): void {
  const now = Date.now();
  const b = store.get(ipHash);
  if (!b || now > b.resetAt) {
    store.set(ipHash, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  b.count += 1;
}
