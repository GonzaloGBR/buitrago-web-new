/**
 * URL pública del bucket R2 (sin barra final).
 *
 * - En cliente: definí `NEXT_PUBLIC_R2_PUBLIC_URL` (mismo valor que `R2_PUBLIC_URL`).
 * - Si no hay env, se usa el dominio `*.r2.dev` del bucket (desarrollo / fallback).
 */
function resolveR2PublicBase(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim() ||
    process.env.R2_PUBLIC_URL?.trim() ||
    "";
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "https://pub-73a172a8457c481781388bbff5c0dfc8.r2.dev";
}

export const R2_PUBLIC_BASE = resolveR2PublicBase();

/** Construye la URL pública de un objeto en el bucket (`carpeta/archivo.jpg`). */
export function r2Asset(key: string): string {
  const k = key.replace(/^\/+/, "");
  return `${R2_PUBLIC_BASE}/${k}`;
}
