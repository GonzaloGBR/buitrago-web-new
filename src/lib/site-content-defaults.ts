import { r2Asset } from "@/lib/r2-public";

export const SITE_CONTENT_KEYS = [
  "homeHeroImage",
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
  philosophyImage: "/detail-joinery.png",
  conocerMasHeroImage: "/workshop.png",
  conocerMasStoryImage: "/detail-joinery.png",
  conocerMasProcesoImage: "/workshop.png",
  conocerMasCtaImage: "/detail-joinery.png",
};
