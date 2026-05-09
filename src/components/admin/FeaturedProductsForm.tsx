"use client";

import { useActionState } from "react";
import {
  saveFeaturedProductsAction,
  type FeaturedFormState,
} from "@/app/admin/actions/featured";
import { AdminField, AdminSelect } from "@/components/admin/AdminFormControls";
import type { Product } from "@/data/catalog";

const POSITIONS = [1, 2, 3, 4] as const;

type Props = {
  products: Product[];
  initialByPosition: Record<number, string | undefined>;
};

export default function FeaturedProductsForm({
  products,
  initialByPosition,
}: Props) {
  const [state, formAction] = useActionState(
    saveFeaturedProductsAction,
    null as FeaturedFormState
  );

  const sorted = [...products].sort((a, b) => {
    const c = a.categorySlug.localeCompare(b.categorySlug);
    return c !== 0 ? c : a.name.localeCompare(b.name);
  });

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      {state?.error ? (
        <p className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 font-sans text-sm text-red-800">
          {state.error}
        </p>
      ) : null}

      {POSITIONS.map((pos) => (
        <AdminField
          key={pos}
          label={
            <>
              Posición {pos}
              {pos === 1 ? " (primera a la izquierda en escritorio)" : ""}
            </>
          }
        >
          <AdminSelect
            name={`product_${pos}`}
            required
            defaultValue={initialByPosition[pos] ?? ""}
          >
            <option value="">— Elegir producto —</option>
            {sorted.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.categorySlug} · {p.id}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
      ))}

      <button
        type="submit"
        className="rounded-sm bg-charcoal px-6 py-3 font-sans text-[0.68rem] font-medium uppercase tracking-[0.18em] text-cream hover:bg-charcoal-light"
      >
        Guardar piezas destacadas
      </button>
    </form>
  );
}
