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

const R2_PUBLIC_BASES = () =>
  [
    process.env.R2_PUBLIC_URL,
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    "https://pub-73a172a8457c481781388bbff5c0dfc8.r2.dev",
  ]
    .filter(Boolean)
    .map((b) => String(b).replace(/\/$/, ""));

/** URL pública de Cloudflare R2 (o /uploads local en desarrollo). */
export function isR2OrUploadsSrc(src: string): boolean {
  if (src.startsWith("/uploads/") || src.includes("/uploads/")) return true;
  return R2_PUBLIC_BASES().some((b) => src.startsWith(b));
}

export function isAvifSrc(src: string): boolean {
  return /\.avif($|\?)/i.test(src);
}

/** Misma ruta en R2 con extensión .webp (respaldo para navegadores sin AVIF). */
export function getRasterFallbackSrc(src: string): string | null {
  if (!isAvifSrc(src)) return null;
  return src.replace(/\.avif(?=($|\?))/i, ".webp");
}

type UnoptimizeOptions = {
  triedRasterFallback?: boolean;
};

/**
 * Las fotos en Cloudflare R2 se sirven con el enlace directo que da R2
 * (sin pasar por /_next/image). En Pages/Workers el optimizador de Next no
 * siempre está disponible; el formato correcto se elige con <picture> en el cliente.
 */
export function shouldUnoptimizeImage(
  src: string,
  options?: UnoptimizeOptions
): boolean {
  if (options?.triedRasterFallback) return true;

  const s = String(src);
  if (!s || s.startsWith("data:")) return true;

  if (isR2OrUploadsSrc(s)) return true;

  return false;
}
