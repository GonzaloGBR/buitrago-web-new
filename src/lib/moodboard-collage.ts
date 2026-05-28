import { normalizeImageSrc } from "@/lib/image-url";
import { r2Asset } from "@/lib/r2-public";

function isUsableImageSrc(src: string): boolean {
  const n = normalizeImageSrc(src);
  if (!n) return false;
  if (/\s/.test(n)) return false;
  return (
    n.startsWith("/") ||
    n.startsWith("http://") ||
    n.startsWith("https://")
  );
}

export const MOODBOARD_COLLAGE_KEYS = [
  "moodboardCollage1",
  "moodboardCollage2",
  "moodboardCollage3",
  "moodboardCollage4",
  "moodboardCollage5",
] as const;

export type MoodboardCollageKey = (typeof MOODBOARD_COLLAGE_KEYS)[number];

export interface MoodboardItem {
  src: string;
  alt: string;
  finalX: string;
  finalY: string;
  width: string;
  height: string;
  rotation: number;
  zIndex: number;
}

/** Posiciones fijas del collage; las URLs vienen del admin / valores por defecto. */
const MOODBOARD_LAYOUT: Omit<MoodboardItem, "src">[] = [
  {
    alt: "Gabinete artesanal",
    finalX: "8%",
    finalY: "12%",
    width: "clamp(140px, 20vw, 280px)",
    height: "clamp(180px, 26vw, 360px)",
    rotation: -3,
    zIndex: 1,
  },
  {
    alt: "Silla de diseño",
    finalX: "28%",
    finalY: "16%",
    width: "clamp(160px, 24vw, 340px)",
    height: "clamp(200px, 28vw, 400px)",
    rotation: -1,
    zIndex: 2,
  },
  {
    alt: "Detalle de carpintería",
    finalX: "52%",
    finalY: "6%",
    width: "clamp(140px, 19vw, 270px)",
    height: "clamp(120px, 16vw, 220px)",
    rotation: 2.5,
    zIndex: 3,
  },
  {
    alt: "Mesa ratona",
    finalX: "54%",
    finalY: "24%",
    width: "clamp(150px, 22vw, 310px)",
    height: "clamp(180px, 24vw, 340px)",
    rotation: 3,
    zIndex: 4,
  },
  {
    alt: "Mesa de comedor",
    finalX: "22%",
    finalY: "44%",
    width: "clamp(160px, 24vw, 340px)",
    height: "clamp(140px, 18vw, 260px)",
    rotation: -2,
    zIndex: 5,
  },
  {
    alt: "Interior con muebles Buitrago",
    finalX: "42%",
    finalY: "40%",
    width: "clamp(170px, 24vw, 340px)",
    height: "clamp(140px, 18vw, 260px)",
    rotation: 1.5,
    zIndex: 6,
  },
];

export const MOODBOARD_COLLAGE_DEFAULTS: readonly string[] = [
  r2Asset("gabinetes/1-gabinetes.jpg"),
  r2Asset("sillas/1-sillas.jpg"),
  r2Asset("gabinetes/2-gabinetes.jpg"),
  r2Asset("mesas-de-centro/3-mesa-de-centro.jpg"),
  r2Asset("mesas-de-comedor/1-mesa-de-comedor.jpg"),
] as const;

/** Etiquetas cortas para el formulario de administración (orden de aparición). */
export const MOODBOARD_COLLAGE_ADMIN_LABELS: readonly string[] = [
  "Tarjeta 1 — gabinete (primera en animarse)",
  "Tarjeta 2 — silla",
  "Tarjeta 3 — detalle de carpintería",
  "Tarjeta 4 — mesa de centro",
  "Tarjeta 5 — mesa de comedor",
] as const;

export function getMoodboardCollageUrls(
  site: Record<MoodboardCollageKey, string>
): string[] {
  return MOODBOARD_COLLAGE_KEYS.map((key, i) => {
    const raw = site[key];
    return isUsableImageSrc(raw) ? normalizeImageSrc(raw) : MOODBOARD_COLLAGE_DEFAULTS[i];
  });
}

/** Última tarjeta = misma foto que el hero (configurable en admin). */
export function getMoodboardItems(
  heroImageSrc: string,
  collageSrcs: string[]
): MoodboardItem[] {
  const hero = isUsableImageSrc(heroImageSrc)
    ? normalizeImageSrc(heroImageSrc)
    : r2Asset("fondo-hero.jpg");
  const urls = [
    ...collageSrcs.slice(0, 5).map((src, i) =>
      isUsableImageSrc(src) ? normalizeImageSrc(src) : MOODBOARD_COLLAGE_DEFAULTS[i]
    ),
    hero,
  ];
  return MOODBOARD_LAYOUT.map((layout, i) => ({
    ...layout,
    src: urls[i] ?? heroImageSrc,
  }));
}
