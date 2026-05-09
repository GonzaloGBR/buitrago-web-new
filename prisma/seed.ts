import { PrismaClient } from "@prisma/client";
import { categories, products } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: {
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        description: c.description,
        image: c.image,
      },
      update: {
        name: c.name,
        tagline: c.tagline,
        description: c.description,
        image: c.image,
      },
    });
  }

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        categorySlug: p.categorySlug,
        name: p.name,
        price: p.price,
        wood: p.wood,
        woodBadge: p.woodBadge,
        dimensions: p.dimensions,
        shortDescription: p.shortDescription,
        description: p.description,
        finish: p.finish,
        image: p.image,
        features: p.features,
        gallery: p.gallery,
      },
      update: {
        categorySlug: p.categorySlug,
        name: p.name,
        price: p.price,
        wood: p.wood,
        woodBadge: p.woodBadge,
        dimensions: p.dimensions,
        shortDescription: p.shortDescription,
        description: p.description,
        finish: p.finish,
        image: p.image,
        features: p.features,
        gallery: p.gallery,
      },
    });
  }

  const featuredDefaults = [
    { position: 1, productId: "comedor-raiz-viva" },
    { position: 2, productId: "ratona-brasa" },
    { position: 3, productId: "estante-linea" },
    { position: 4, productId: "comedor-paramo" },
  ] as const;
  for (const row of featuredDefaults) {
    await prisma.featuredProduct.upsert({
      where: { position: row.position },
      create: { position: row.position, productId: row.productId },
      update: { productId: row.productId },
    });
  }

  /**
   * Variantes de medida de ejemplo (productId → lista ordenada de {label, price}).
   *
   * Estrategia: para cada productId del mapa borramos sus filas y las volvemos a crear con
   * `position` por orden. Es idempotente y permite re-ejecutar el seed sin duplicar datos.
   *
   * Si querés que un producto NO tenga variantes (precio único), simplemente no lo incluyas
   * acá — el seed no toca productos ausentes.
   */
  const seedSizesByProductId: Record<
    string,
    { label: string; price: string }[]
  > = {
    "comedor-raiz-viva": [
      { label: "180×100", price: "$ 4.490.000" },
      { label: "200×100", price: "$ 4.990.000" },
      { label: "220×100", price: "$ 5.490.000" },
      { label: "240×110", price: "$ 5.990.000" },
    ],
    "comedor-paramo": [
      { label: "160×90", price: "$ 3.290.000" },
      { label: "180×90", price: "$ 3.690.000" },
      { label: "200×100", price: "$ 4.090.000" },
    ],
  };
  for (const [productId, rows] of Object.entries(seedSizesByProductId)) {
    await prisma.productSize.deleteMany({ where: { productId } });
    if (rows.length === 0) continue;
    await prisma.productSize.createMany({
      data: rows.map((r, i) => ({
        productId,
        label: r.label,
        price: r.price,
        position: i,
      })),
    });
  }
}

main()
  .then(() => {
    console.log("Seed OK");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
