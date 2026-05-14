import { PrismaClient } from "@prisma/client";
import { categories, products } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
  await prisma.finishOption.deleteMany();
  await prisma.woodSpecies.deleteMany();
  await prisma.woodSpecies.createMany({
    data: [
      { slug: "cedro", label: "Cedro", position: 0 },
      { slug: "roble", label: "Roble", position: 1 },
      { slug: "nogal", label: "Nogal", position: 2 },
      { slug: "quina", label: "Quina", position: 3 },
      { slug: "petiribi", label: "Petiribí", position: 4 },
    ],
  });
  await prisma.finishOption.createMany({
    data: [
      { slug: "mate", label: "Mate", position: 0 },
      { slug: "semi_brillante", label: "Semi-brillante", position: 1 },
      { slug: "brillante", label: "Brillante", position: 2 },
    ],
  });

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

  await prisma.siteContent.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {},
  });
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
