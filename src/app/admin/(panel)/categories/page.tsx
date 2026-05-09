import Link from "next/link";
import { getCategories } from "@/data/catalog";
import DeleteCategoryForm from "@/components/admin/DeleteCategoryForm";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; error?: string }>;
}) {
  const { deleted, error } = await searchParams;
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Categorías</h1>
          <p className="mt-1 font-sans text-sm text-warm-gray">
            {categories.length} categoría(s)
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-sm bg-charcoal px-4 py-2.5 font-sans text-[0.65rem] font-medium uppercase tracking-[0.15em] text-cream hover:bg-charcoal-light"
        >
          Nueva categoría
        </Link>
      </div>

      {deleted ? (
        <p className="rounded-sm border border-green-200 bg-green-50 px-3 py-2 font-sans text-sm text-green-900">
          Categoría eliminada.
        </p>
      ) : null}
      {error === "delete" ? (
        <p className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 font-sans text-sm text-red-800">
          No se pudo eliminar.
        </p>
      ) : null}

      <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-charcoal/10 bg-cream/80 font-sans text-[0.65rem] uppercase tracking-[0.12em] text-warm-gray">
            <tr>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {categories.map((c) => (
              <tr key={c.slug} className="font-sans text-charcoal">
                <td className="px-4 py-3 font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products?categoria=${encodeURIComponent(c.slug)}`}
                    className="mr-4 font-sans text-xs text-charcoal/60 underline decoration-charcoal/20 underline-offset-2 hover:text-charcoal"
                  >
                    Productos
                  </Link>
                  <Link
                    href={`/admin/categories/${c.slug}/edit`}
                    className="mr-4 text-gold hover:text-gold-dark"
                  >
                    Editar
                  </Link>
                  <DeleteCategoryForm slug={c.slug} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 ? (
          <p className="px-4 py-8 text-center font-sans text-sm text-warm-gray">
            No hay categorías. Creá la primera.
          </p>
        ) : null}
      </div>
    </div>
  );
}
