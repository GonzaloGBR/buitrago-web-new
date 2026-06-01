import { normalizeImageSrc } from "@/lib/image-url";

function normalizeGalleryUrl(src: string): string {
  return normalizeImageSrc(src).trim();
}

function urlsMatch(a: string, b: string): boolean {
  return normalizeGalleryUrl(a) === normalizeGalleryUrl(b);
}

/**
 * Si `image` quedó truncada en BD pero la galería tiene la URL completa
 * (mismo prefijo), devuelve la versión completa.
 */
export function healTruncatedMainImage(
  image: string,
  gallery: string[]
): string {
  const main = normalizeGalleryUrl(image);
  if (!main) return gallery[0] ? normalizeGalleryUrl(gallery[0]) : "";

  for (const url of gallery) {
    const full = normalizeGalleryUrl(url);
    if (!full) continue;
    if (full === main) return main;
    if (full.startsWith(main) && full.length > main.length) return full;
  }

  return main;
}

/** Imagen principal + extras sin duplicados; la principal siempre va primera. */
export function mergeProductGallery(
  mainImage: string,
  extraUrls: string[]
): string[] {
  const main = normalizeGalleryUrl(mainImage);
  if (!main) {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const url of extraUrls) {
      const n = normalizeGalleryUrl(url);
      if (!n || seen.has(n)) continue;
      seen.add(n);
      out.push(n);
    }
    return out;
  }

  const seen = new Set<string>([main]);
  const out = [main];
  for (const url of extraUrls) {
    const n = normalizeGalleryUrl(url);
    if (!n || seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}

/** URLs para el textarea del admin (sin la imagen principal). */
export function galleryExtrasForAdmin(
  mainImage: string,
  storedGallery: string[]
): string[] {
  const main = normalizeGalleryUrl(mainImage);
  return storedGallery
    .map(normalizeGalleryUrl)
    .filter((url) => url && !urlsMatch(url, main));
}
