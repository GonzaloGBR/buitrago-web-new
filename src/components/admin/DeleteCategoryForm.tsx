"use client";

import { deleteCategoryAction } from "@/app/admin/actions/categories";

export default function DeleteCategoryForm({ slug }: { slug: string }) {
  return (
    <form
      action={deleteCategoryAction.bind(null, slug)}
      onSubmit={(e) => {
        if (
          !confirm(
            "¿Eliminar esta categoría? Se borrarán también todos sus productos."
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="font-sans text-xs text-red-700 underline hover:text-red-900"
      >
        Eliminar
      </button>
    </form>
  );
}
