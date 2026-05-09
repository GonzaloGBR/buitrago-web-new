import Link from "next/link";
import { getAllProducts, getFeaturedProductIds } from "@/data/catalog";
import FeaturedProductsForm from "@/components/admin/FeaturedProductsForm";

export const dynamic = "force-dynamic";

export default async function AdminFeaturedPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const [products, featuredRows] = await Promise.all([
    getAllProducts(),
    getFeaturedProductIds(),
  ]);

  const initialByPosition = Object.fromEntries(
    featuredRows.map((r) => [r.position, r.productId])
  ) as Record<number, string | undefined>;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin"
          className="font-sans text-sm text-warm-gray hover:text-charcoal"
        >
          ← Volver al panel
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-charcoal">
          Piezas destacadas (inicio)
        </h1>
        <p className="mt-2 max-w-xl font-sans text-sm text-warm-gray">
          Son las cuatro fichas bajo «Descubre nuestras piezas destacadas». Cada
          una enlaza a la ficha del producto, igual que en el catálogo por
          categoría.
        </p>
      </div>

      {ok ? (
        <p className="rounded-sm border border-green-200 bg-green-50 px-3 py-2 font-sans text-sm text-green-900">
          Cambios guardados.
        </p>
      ) : null}

      {products.length < 4 ? (
        <p className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950">
          Necesitás al menos cuatro productos en el catálogo para completar esta
          sección.
        </p>
      ) : null}

      <FeaturedProductsForm
        products={products}
        initialByPosition={initialByPosition}
      />
    </div>
  );
}
