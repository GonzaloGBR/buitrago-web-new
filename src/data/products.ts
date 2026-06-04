import type { Category, Product } from "./catalog";
import { r2Asset } from "@/lib/r2-public";
import {
  PRODUCT_FINISH_STORED,
  PRODUCT_WOOD_BADGE,
  PRODUCT_WOOD_STORED,
} from "@/lib/product-defaults";

/**
 * Rutas en Cloudflare R2 (`buitrago-media`), alineadas con tus carpetas:
 * - gabinetes: 1…5 → `n-gabinetes.jpg`
 * - mesas-de-centro: 1…8 → `n-mesa-de-centro.jpg`
 * - mesas-de-comedor: 1…6 → `n-mesa-de-comedor.jpg`
 * - sillas: 1…6 → `n-sillas.jpg`
 */
const R2 = {
  gabinete: (n: number) => r2Asset(`gabinetes/${n}-gabinetes.jpg`),
  mesaCentro: (n: number) => r2Asset(`mesas-de-centro/${n}-mesa-de-centro.jpg`),
  mesaComedor: (n: number) => r2Asset(`mesas-de-comedor/${n}-mesa-de-comedor.jpg`),
  silla: (n: number) => r2Asset(`sillas/${n}-sillas.jpg`),
};

/**
 * Datos iniciales para `npx prisma db seed`. En runtime la app lee vía Prisma (`@/data/catalog`).
 */
export type SeedProduct = Omit<Product, "sizes">;

function seedProduct(
  id: string,
  name: string,
  categorySlug: string,
  imageUrl: string
): SeedProduct {
  return {
    id,
    name,
    categorySlug,
    price: "Consultar",
    wood: PRODUCT_WOOD_STORED,
    woodBadge: PRODUCT_WOOD_BADGE,
    dimensions: "Medidas a medida",
    height: null,
    shortDescription: `${name}. Pieza artesanal Buitrago en madera maciza, Salta.`,
    description: `${name}, fabricado en nuestro taller. Trabajamos maderas nobles con ensambles tradicionales y acabados naturales o lacados según tu proyecto. Asesoramos medidas, madera y terminación para que la pieza encaje en tu espacio.`,
    finish: PRODUCT_FINISH_STORED,
    features: [
      "Madera maciza",
      "Diseño y fabricación artesanal",
      "Acabados personalizables",
      "Asesoramiento y presupuesto sin cargo",
    ],
    image: imageUrl,
    gallery: [imageUrl],
  };
}

export const categories: Category[] = [
  {
    slug: "gabinetes",
    name: "Gabinetes",
    tagline: "Almacenar con presencia",
    description:
      "Gabinetes y muebles de guardado en madera maciza. Líneas limpias, herrajes de calidad y terminaciones que destacan la veta.",
    image: R2.gabinete(1),
  },
  {
    slug: "mesas-de-centro",
    name: "Mesas de centro",
    tagline: "El corazón de la sala",
    description:
      "Mesas ratonas y de centro que anclan el living. Proporciones estudiadas, superficies generosas y la calidez de lo hecho a mano.",
    image: R2.mesaCentro(1),
  },
  {
    slug: "mesas-de-comedor",
    name: "Mesas de comedor",
    tagline: "Donde se reúne la mesa",
    description:
      "Mesas de comedor pensadas para compartir. Estructuras sólidas, tableros nobles y acabados duraderos para el uso diario.",
    image: R2.mesaComedor(1),
  },
  {
    slug: "sillas",
    name: "Sillas",
    tagline: "Comodidad y carácter",
    description:
      "Sillas en madera maciza con ergonomía y estilo. Diseños que acompañan mesas Buitrago o completan tu espacio a la medida.",
    image: R2.silla(1),
  },
];

export const products: SeedProduct[] = [
  ...Array.from({ length: 5 }, (_, i) => {
    const n = i + 1;
    return seedProduct(`gabinete-${n}`, `Gabinete ${n}`, "gabinetes", R2.gabinete(n));
  }),
  ...Array.from({ length: 8 }, (_, i) => {
    const n = i + 1;
    return seedProduct(
      `mesa-centro-${n}`,
      `Mesa de centro ${n}`,
      "mesas-de-centro",
      R2.mesaCentro(n)
    );
  }),
  ...Array.from({ length: 6 }, (_, i) => {
    const n = i + 1;
    return seedProduct(
      `mesa-comedor-${n}`,
      `Mesa de comedor ${n}`,
      "mesas-de-comedor",
      R2.mesaComedor(n)
    );
  }),
  ...Array.from({ length: 6 }, (_, i) => {
    const n = i + 1;
    return seedProduct(`silla-${n}`, `Silla ${n}`, "sillas", R2.silla(n));
  }),
];
