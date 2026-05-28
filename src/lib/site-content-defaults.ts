import { r2Asset } from "@/lib/r2-public";
import {
  MOODBOARD_COLLAGE_DEFAULTS,
  MOODBOARD_COLLAGE_KEYS,
} from "@/lib/moodboard-collage";

export { MOODBOARD_COLLAGE_KEYS };

export const SITE_CONTENT_KEYS = [
  "homeHeroImage",
  ...MOODBOARD_COLLAGE_KEYS,
  "philosophyImage",
  "conocerMasHeroImage",
  "conocerMasStoryImage",
  "conocerMasProcesoImage",
  "conocerMasCtaImage",
] as const;

export type SiteContentKey = (typeof SITE_CONTENT_KEYS)[number];

export type SiteContentValues = Record<SiteContentKey, string>;

/** Valores por defecto cuando en BD el campo está vacío. */
export const SITE_CONTENT_DEFAULTS: SiteContentValues = {
  homeHeroImage: r2Asset("fondo-hero.jpg"),
  moodboardCollage1: MOODBOARD_COLLAGE_DEFAULTS[0],
  moodboardCollage2: MOODBOARD_COLLAGE_DEFAULTS[1],
  moodboardCollage3: MOODBOARD_COLLAGE_DEFAULTS[2],
  moodboardCollage4: MOODBOARD_COLLAGE_DEFAULTS[3],
  moodboardCollage5: MOODBOARD_COLLAGE_DEFAULTS[4],
  philosophyImage: "/detail-joinery.png",
  conocerMasHeroImage: "/workshop.png",
  conocerMasStoryImage: "/detail-joinery.png",
  conocerMasProcesoImage: "/workshop.png",
  conocerMasCtaImage: "/detail-joinery.png",
};
