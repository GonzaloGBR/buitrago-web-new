import { notFound } from "next/navigation";
import {
  getCategory,
  getFinishOptions,
  getProduct,
  getProductsByCategory,
  getWoodSpecies,
} from "@/data/catalog";
import ProductDetailClient from "./product-detail-client";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const { slug, productId } = await params;

  const [product, category, woodSpecies, finishOptions] = await Promise.all([
    getProduct(productId),
    getCategory(slug),
    getWoodSpecies(),
    getFinishOptions(),
  ]);

  if (!product || !category || product.categorySlug !== slug) {
    notFound();
  }

  const similarProducts = (await getProductsByCategory(slug)).filter(
    (p) => p.id !== product.id
  );

  return (
    <ProductDetailClient
      slug={slug}
      product={product}
      category={category}
      similarProducts={similarProducts}
      woodSpecies={woodSpecies}
      finishOptions={finishOptions}
    />
  );
}
