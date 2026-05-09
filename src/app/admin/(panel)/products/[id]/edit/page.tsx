import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getCategories, getProduct } from "@/data/catalog";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProduct(id),
    getCategories(),
  ]);
  if (!product) notFound();

  const backToProductsHref = `/admin/products?categoria=${encodeURIComponent(
    product.categorySlug
  )}`;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={backToProductsHref}
          className="font-sans text-sm text-warm-gray hover:text-charcoal"
        >
          ← Volver a productos de esta categoría
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-charcoal">
          Editar producto
        </h1>
      </div>
      <Suspense fallback={<p className="font-sans text-sm text-warm-gray">Cargando formulario…</p>}>
        <ProductForm
          mode="edit"
          categories={categories}
          initial={product}
        />
      </Suspense>
    </div>
  );
}
