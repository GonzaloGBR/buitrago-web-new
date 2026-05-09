import Link from "next/link";
import { Suspense } from "react";
import { getCategories } from "@/data/catalog";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria: categoriaRaw } = await searchParams;
  const categories = await getCategories();
  const slugSet = new Set(categories.map((c) => c.slug));
  const categoriaParam = categoriaRaw?.trim() || "";
  const defaultCategorySlug =
    categoriaParam && slugSet.has(categoriaParam) ? categoriaParam : undefined;
  const nameBySlug = Object.fromEntries(
    categories.map((c) => [c.slug, c.name])
  );
  const listHref = defaultCategorySlug
    ? `/admin/products?categoria=${encodeURIComponent(defaultCategorySlug)}`
    : "/admin/products";

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={listHref}
          className="font-sans text-sm text-warm-gray hover:text-charcoal"
        >
          ← Volver a productos
          {defaultCategorySlug && nameBySlug[defaultCategorySlug]
            ? ` (${nameBySlug[defaultCategorySlug]})`
            : ""}
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-charcoal">
          Nuevo producto
        </h1>
        {defaultCategorySlug && nameBySlug[defaultCategorySlug] ? (
          <p className="mt-2 font-sans text-sm text-warm-gray">
            Categoría sugerida:{" "}
            <span className="font-medium text-charcoal">
              {nameBySlug[defaultCategorySlug]}
            </span>{" "}
            (podés cambiarla en el formulario).
          </p>
        ) : null}
      </div>
      {categories.length === 0 ? (
        <p className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950">
          Primero tenés que crear al menos una{" "}
          <Link href="/admin/categories/new" className="underline">
            categoría
          </Link>
          .
        </p>
      ) : (
        <Suspense fallback={<p className="font-sans text-sm text-warm-gray">Cargando formulario…</p>}>
          <ProductForm
            mode="create"
            categories={categories}
            defaultCategorySlug={defaultCategorySlug}
          />
        </Suspense>
      )}
    </div>
  );
}
