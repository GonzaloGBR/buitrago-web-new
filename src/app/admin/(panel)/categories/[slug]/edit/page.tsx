import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getCategory } from "@/data/catalog";
import CategoryForm from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/categories"
          className="font-sans text-sm text-warm-gray hover:text-charcoal"
        >
          ← Volver a categorías
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-charcoal">
          Editar categoría
        </h1>
      </div>
      <Suspense fallback={<p className="font-sans text-sm text-warm-gray">Cargando formulario…</p>}>
        <CategoryForm mode="edit" initial={cat} />
      </Suspense>
    </div>
  );
}
