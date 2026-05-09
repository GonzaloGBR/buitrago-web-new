"use client";

import { useId, useMemo, useState } from "react";
import {
  ADMIN_LABEL_CLASS,
  AdminInput,
} from "@/components/admin/AdminFormControls";
import type { ProductSize } from "@/data/catalog";

/**
 * Editor repetidor para variantes de medida del producto.
 *
 * Cómo se serializa al server action:
 *  - Mantenemos las filas en estado React (`rows`).
 *  - Un único <input type="hidden" name="sizes"> con JSON.stringify(rows) viaja en el FormData.
 *  - El server action lo parsea con `parseSizes()`.
 *
 * Ventajas vs un par de inputs name="sizeLabel[]" / name="sizePrice[]":
 *  - Un solo punto de verdad: imposible que label y price queden desincronizados.
 *  - Reordenar / borrar / añadir filas no requiere mantener N inputs sincronizados.
 *  - Más fácil de extender si en el futuro queremos agregar atributos (stock, sku, etc).
 */
type Row = {
  /** clave estable para el key de React; NO se envía al server. */
  key: string;
  label: string;
  price: string;
};

type Props = {
  defaultSizes?: ProductSize[];
};

let nextKeyCounter = 0;
function freshKey(): string {
  nextKeyCounter += 1;
  return `s-${Date.now()}-${nextKeyCounter}`;
}

function fromInitial(initial: ProductSize[] | undefined): Row[] {
  if (!initial || initial.length === 0) return [];
  return initial.map((s) => ({
    key: freshKey(),
    label: s.label,
    price: s.price === "—" ? "" : s.price,
  }));
}

export default function ProductSizesField({ defaultSizes }: Props) {
  const [rows, setRows] = useState<Row[]>(() => fromInitial(defaultSizes));
  const inputId = useId();

  /**
   * Solo enviamos al server las filas con label NO vacío. Así el admin puede dejar una fila
   * en blanco al final mientras escribe sin que se persistan filas basura.
   */
  const serialized = useMemo(
    () =>
      JSON.stringify(
        rows
          .filter((r) => r.label.trim().length > 0)
          .map((r) => ({ label: r.label.trim(), price: r.price.trim() }))
      ),
    [rows]
  );

  const addRow = () => {
    setRows((prev) => [...prev, { key: freshKey(), label: "", price: "" }]);
  };

  const removeRow = (key: string) => {
    setRows((prev) => prev.filter((r) => r.key !== key));
  };

  const updateRow = (key: string, patch: Partial<Pick<Row, "label" | "price">>) => {
    setRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, ...patch } : r))
    );
  };

  const moveRow = (key: string, direction: -1 | 1) => {
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.key === key);
      if (idx < 0) return prev;
      const target = idx + direction;
      if (target < 0 || target >= prev.length) return prev;
      const copy = prev.slice();
      const [item] = copy.splice(idx, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  };

  return (
    <fieldset className="space-y-3">
      <legend className={ADMIN_LABEL_CLASS}>
        Medidas y precios (opcional)
      </legend>
      <p className="font-sans text-xs text-warm-gray">
        Cada fila representa una variante seleccionable por el cliente. Si dejás
        este bloque vacío, el producto se mostrará con un único precio (el de
        arriba). El orden definido aquí es el que verá el cliente.
      </p>

      {rows.length === 0 ? (
        <p className="rounded-sm border border-dashed border-charcoal/20 bg-white px-3 py-4 font-sans text-xs text-warm-gray">
          Sin variantes. El producto usará el precio principal.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r, i) => (
            <li
              key={r.key}
              className="flex flex-wrap items-center gap-2 rounded-sm border border-charcoal/10 bg-white p-2 sm:flex-nowrap"
            >
              <div className="flex w-full items-center gap-2 sm:w-auto sm:flex-1">
                <span
                  aria-hidden
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-charcoal/5 font-mono text-[0.65rem] text-charcoal/70"
                >
                  {i + 1}
                </span>
                <AdminInput
                  aria-label={`Etiqueta de la medida ${i + 1}`}
                  placeholder="140x90"
                  value={r.label}
                  onChange={(e) => updateRow(r.key, { label: e.target.value })}
                  className="flex-1"
                />
              </div>
              <AdminInput
                aria-label={`Precio de la medida ${i + 1}`}
                placeholder="$2.819.000"
                value={r.price}
                onChange={(e) => updateRow(r.key, { price: e.target.value })}
                className="w-full sm:w-44"
              />
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveRow(r.key, -1)}
                  disabled={i === 0}
                  aria-label={`Mover medida ${i + 1} hacia arriba`}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border border-charcoal/15 bg-white font-sans text-xs text-charcoal/70 transition-colors hover:border-charcoal/40 hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveRow(r.key, 1)}
                  disabled={i === rows.length - 1}
                  aria-label={`Mover medida ${i + 1} hacia abajo`}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border border-charcoal/15 bg-white font-sans text-xs text-charcoal/70 transition-colors hover:border-charcoal/40 hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeRow(r.key)}
                  aria-label={`Eliminar medida ${i + 1}`}
                  className="inline-flex h-8 cursor-pointer items-center justify-center rounded-sm border border-red-200 bg-red-50 px-2.5 font-sans text-xs text-red-700 transition-colors hover:border-red-400 hover:bg-red-100"
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={addRow}
        className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-charcoal/20 bg-white px-3.5 py-2 font-sans text-xs text-charcoal transition-colors hover:border-charcoal/50 hover:bg-cream"
      >
        + Añadir medida
      </button>

      <input id={inputId} type="hidden" name="sizes" value={serialized} />
    </fieldset>
  );
}
