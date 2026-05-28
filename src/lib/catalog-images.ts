import { prisma } from "@/lib/prisma";
import { SITE_CONTENT_KEYS } from "@/lib/site-content-defaults";
import { normalizeGallery, normalizeImageSrc } from "@/lib/image-url";

export type CatalogImageOption = {
  url: string;
  caption: string;
};

export type AllSiteImagesResult = {
  images: CatalogImageOption[];
};

/** Todas las imágenes referenciadas en el sitio (categorías, productos, imágenes del sitio). */
export async function listAllSiteImages(): Promise<AllSiteImagesResult> {
  const seen = new Set<string>();
  const images: CatalogImageOption[] = [];

  const add = (raw: string, caption: string) => {
    const url = normalizeImageSrc(raw);
    if (!url || seen.has(url)) return;
    seen.add(url);
    images.push({ url, caption });
  };

  const [categories, products, siteRow] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      orderBy: [{ categorySlug: "asc" }, { name: "asc" }],
    }),
    prisma.siteContent.findUnique({ where: { id: 1 } }),
  ]);

  for (const c of categories) {
    if (c.image) add(c.image, `${c.name} — portada de categoría`);
  }

  const categoryNames = Object.fromEntries(
    categories.map((c) => [c.slug, c.name])
  );

  for (const p of products) {
    const cat = categoryNames[p.categorySlug] ?? p.categorySlug;
    if (p.image) add(p.image, `${p.name} (${cat}) — principal`);
    for (const g of normalizeGallery(p.gallery as unknown[])) {
      add(g, `${p.name} (${cat}) — galería`);
    }
  }

  if (siteRow) {
    const siteLabels: Record<string, string> = {
      homeHeroImage: "Sitio — hero inicio",
      moodboardCollage1: "Sitio — collage carga 1",
      moodboardCollage2: "Sitio — collage carga 2",
      moodboardCollage3: "Sitio — collage carga 3",
      moodboardCollage4: "Sitio — collage carga 4",
      moodboardCollage5: "Sitio — collage carga 5",
      philosophyImage: "Sitio — nuestra filosofía",
      conocerMasHeroImage: "Sitio — conocer más hero",
      conocerMasStoryImage: "Sitio — conocer más origen",
      conocerMasProcesoImage: "Sitio — conocer más proceso",
      conocerMasCtaImage: "Sitio — conocer más cierre",
    };
    for (const key of SITE_CONTENT_KEYS) {
      const raw = siteRow[key as keyof typeof siteRow];
      if (typeof raw === "string" && raw) {
        add(raw, siteLabels[key] ?? `Sitio — ${key}`);
      }
    }
  }

  images.sort((a, b) => a.caption.localeCompare(b.caption, "es"));

  return { images };
}
