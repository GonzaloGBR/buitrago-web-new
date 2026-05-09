import { prisma } from "@/lib/prisma";
import {
  SITE_CONTENT_DEFAULTS,
  type SiteContentValues,
} from "@/lib/site-content-defaults";
import { normalizeImageSrc } from "@/lib/image-url";

function pick(
  raw: string | null | undefined,
  fallback: string
): string {
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
