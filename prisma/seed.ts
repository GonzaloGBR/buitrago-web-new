import { PrismaClient } from "@prisma/client";
import { categories, products } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
  /** Catálogo nuevo: vaciar tablas relacionadas y volver a crear desde `src/data/products`. */
  await prisma.featuredProduct.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  for (const c of categories) {
    await prisma.category.create({
      data: {
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        description: c.description,
        image: c.image,
      },
    });
  }

  for (const p of products) {
    await prisma.product.create({
      data: {
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
    });
  }

  const featuredDefaults = [
    { position: 1, productId: "mesa-comedor-1" },
    { position: 2, productId: "mesa-centro-1" },
    { position: 3, productId: "gabinete-1" },
    { position: 4, productId: "silla-1" },
  ] as const;
  for (const row of featuredDefaults) {
    await prisma.featuredProduct.create({
      data: { position: row.position, productId: row.productId },
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
