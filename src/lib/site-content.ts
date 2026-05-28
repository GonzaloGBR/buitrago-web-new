import { prisma } from "@/lib/prisma";
import {
  SITE_CONTENT_DEFAULTS,
  type SiteContentValues,
} from "@/lib/site-content-defaults";
import { normalizeImageSrc } from "@/lib/image-url";

function pick(raw: string | null | undefined, fallback: string): string {
  const n = normalizeImageSrc(raw);
  return n || fallback;
}

/** URL efectiva que ve el visitante (BD + fallback). */
export async function getSiteContent(): Promise<SiteContentValues> {
  const row = await prisma.siteContent.findUnique({ where: { id: 1 } });
  const d = SITE_CONTENT_DEFAULTS;
  if (!row) return { ...d };
  return {
    homeHeroImage: pick(row.homeHeroImage, d.homeHeroImage),
    moodboardCollage1: pick(row.moodboardCollage1, d.moodboardCollage1),
    moodboardCollage2: pick(row.moodboardCollage2, d.moodboardCollage2),
    moodboardCollage3: pick(row.moodboardCollage3, d.moodboardCollage3),
    moodboardCollage4: pick(row.moodboardCollage4, d.moodboardCollage4),
    moodboardCollage5: pick(row.moodboardCollage5, d.moodboardCollage5),
    philosophyImage: pick(row.philosophyImage, d.philosophyImage),
    conocerMasHeroImage: pick(row.conocerMasHeroImage, d.conocerMasHeroImage),
    conocerMasStoryImage: pick(row.conocerMasStoryImage, d.conocerMasStoryImage),
    conocerMasProcesoImage: pick(
      row.conocerMasProcesoImage,
      d.conocerMasProcesoImage
    ),
    conocerMasCtaImage: pick(row.conocerMasCtaImage, d.conocerMasCtaImage),
  };
}
