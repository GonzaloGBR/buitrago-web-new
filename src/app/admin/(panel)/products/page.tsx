import Link from "next/link";
import {
  getAllProducts,
  getCategories,
  getProductsByCategory,
} from "@/data/catalog";
import DeleteProductForm from "@/components/admin/DeleteProductForm";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    deleted?: string;
    error?: string;
    categoria?: string;
  }>;
}) {
  const { deleted, error, categoria: categoriaRaw } = await searchParams;
  const categories = await getCategories();
  const slugSet = new Set(categories.map((c) => c.slug));
  const categoriaParam = categoriaRaw?.trim() || "";
  const activeCategorySlug =
    categoriaParam && slugSet.has(categoriaParam) ? categoriaParam : null;
  const unknownCategoryFilter =
    Boolean(categoriaParam) && !slugSet.has(categoriaParam);

  const products = activeCategorySlug
    ? await getProductsByCategory(activeCategorySlug)
    : await getAllProducts();

  const nameBySlug = Object.fromEntries(
    categories.map((c) => [c.slug, c.name])
  );
  const activeCategoryName = activeCategorySlug
    ? nameBySlug[activeCategorySlug]
    : null;

  const newProductHref = activeCategorySlug
    ? `/admin/products/new?categoria=${encodeURIComponent(activeCategorySlug)}`
    : "/admin/products/new";

  const tabBase =
    "rounded-sm border px-3 py-2 font-sans text-[0.72rem] transition-colors";
  const tabInactive = `${tabBase} border-charcoal/15 bg-white text-charcoal/70 hover:border-charcoal/30 hover:text-charcoal`;
  const tabActive = `${tabBase} border-charcoal bg-charcoal text-cream`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Productos</h1>
          <p className="mt-1 font-sans text-sm text-warm-gray">
            {activeCategoryName ? (
              <>
                <span className="text-charcoal">{activeCategoryName}</span>
                {" · "}
                {products.length} producto(s) en esta categoría
              </>
            ) : (
              <>
                Todas las categorías · {products.length} producto(s) en total
              </>
            )}
          </p>
        </div>
        <Link
          href={newProductHref}
          className="rounded-sm bg-charcoal px-4 py-2.5 font-sans text-[0.65rem] font-medium uppercase tracking-[0.15em] text-cream hover:bg-charcoal-light"
        >
          Nuevo producto
          {activeCategoryName ? ` (${activeCategoryName})` : ""}
        </Link>
      </div>

      <div className="space-y-2">
        <p className="font-sans text-[0.65rem] uppercase tracking-[0.12em] text-warm-gray">
          Ver por categoría
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products"
            className={!activeCategorySlug ? tabActive : tabInactive}
          >
            Todas
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/admin/products?categoria=${encodeURIComponent(c.slug)}`}
              className={
                activeCategorySlug === c.slug ? tabActive : tabInactive
              }
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {unknownCategoryFilter ? (
        <p className="rounded-sm border border-amber-200 bg-amber-50 px-3 py-2 font-sans text-sm text-amber-950">
          No existe la categoría «{categoriaParam}». Mostrando todos los
          productos.
        </p>
      ) : null}

      {deleted ? (
        <p className="rounded-sm border border-green-200 bg-green-50 px-3 py-2 font-sans text-sm text-green-900">
          Producto eliminado.
        </p>
      ) : null}
      {error === "delete" ? (
        <p className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 font-sans text-sm text-red-800">
          No se pudo eliminar.
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-sm border border-charcoal/10 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-charcoal/10 bg-cream/80 font-sans text-[0.65rem] uppercase tracking-[0.12em] text-warm-gray">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              {!activeCategorySlug ? (
                <th className="px-4 py-3">Categoría</th>
              ) : null}
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {products.map((p) => (
              <tr key={p.id} className="font-sans text-charcoal">
                <td className="max-w-[140px] truncate px-4 py-3 font-mono text-xs">
                  {p.id}
                </td>
                <td className="px-4 py-3">{p.name}</td>
                {!activeCategorySlug ? (
                  <td className="px-4 py-3 text-sm text-charcoal">
                    <span className="text-charcoal/90">
                      {nameBySlug[p.categorySlug] ?? p.categorySlug}
                    </span>
                    <span className="mt-0.5 block font-mono text-[0.65rem] text-warm-gray">
                      {p.categorySlug}
                    </span>
                  </td>
                ) : null}
                <td className="px-4 py-3">{p.price}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="mr-4 text-gold hover:text-gold-dark"
                  >
                    Editar
                  </Link>
                  <DeleteProductForm
                    productId={p.id}
                    categorySlug={p.categorySlug}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 ? (
          <p className="px-4 py-8 text-center font-sans text-sm text-warm-gray">
            {activeCategoryName
              ? `No hay productos en «${activeCategoryName}».`
              : "No hay productos. Creá el primero o ejecutá el seed."}{" "}
            <Link
              href={newProductHref}
              className="text-gold underline decoration-gold/30 underline-offset-2 hover:text-gold-dark"
            >
              Crear uno
            </Link>
            {activeCategorySlug ? (
              <>
                {" "}
                o{" "}
                <Link
                  href="/admin/products"
                  className="text-charcoal underline decoration-charcoal/20 underline-offset-2"
                >
                  ver todas las categorías
                </Link>
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}
