/**
 * Normaliza rutas de imagen guardadas en BD o pegadas en el admin.
 * Evita URLs relativas rotas (p. ej. "uploads/x.jpg" sin "/" → 404 según la página).
 */
export function normalizeImageSrc(src: string | null | undefined): string {
  if (src == null || typeof src !== "string") return "";
  let s = src.trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) {
    return s;
  }
  s = s.replace(/^\/+/, "");
  if (s.startsWith("public/")) {
    s = s.slice("public/".length);
  }
  if (!s.startsWith("/")) {
    s = `/${s}`;
  }
  return s;
}

export function normalizeGallery(urls: unknown): string[] {
  if (!Array.isArray(urls)) return [];
  return urls
    .map((u) => (typeof u === "string" ? normalizeImageSrc(u) : ""))
    .filter(Boolean);
}

/** Subidas del panel / R2: mejor servir sin pasar por el optimizador (menos fallos en hosting). */
export function shouldUnoptimizeImage(src: string): boolean {
  const s = String(src);
  if (s.startsWith("/uploads/") || s.includes("/uploads/")) return true;
  const bases = [
    process.env.R2_PUBLIC_URL,
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    "https://pub-73a172a8457c481781388bbff5c0dfc8.r2.dev",
  ]
    .filter(Boolean)
    .map((b) => String(b).replace(/\/$/, ""));
  if (bases.some((b) => s.startsWith(b))) return true;
  return false;
}
