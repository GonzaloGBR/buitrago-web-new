import { Suspense } from "react";
import Link from "next/link";
import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
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
          Nueva categoría
        </h1>
      </div>
      <Suspense fallback={<p className="font-sans text-sm text-warm-gray">Cargando formulario…</p>}>
        <CategoryForm mode="create" />
      </Suspense>
    </div>
  );
}
