"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import {
  createProductAction,
  updateProductAction,
  type ProductFormState,
} from "@/app/admin/actions/products";
import AdminImageField from "@/components/admin/AdminImageField";
import AdminGalleryField from "@/components/admin/AdminGalleryField";
import ProductSizesField from "@/components/admin/ProductSizesField";
import {
  ADMIN_LABEL_CLASS,
  AdminField,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/AdminFormControls";
import type { Category, Product } from "@/data/catalog";

type Props =
  | { mode: "create"; categories: Category[]; defaultCategorySlug?: string }
  | { mode: "edit"; categories: Category[]; initial: Product };

function getProductFormAction(props: Props) {
  if (props.mode === "create") return createProductAction;
  return updateProductAction.bind(null, props.initial.id);
}

export default function ProductForm(props: Props) {
  const searchParams = useSearchParams();
  const ok = searchParams.get("ok");
  const initial = props.mode === "edit" ? props.initial : null;
  const defaultCategorySlug =
    props.mode === "create" ? props.defaultCategorySlug : undefined;

  const [state, formAction] = useActionState(
    getProductFormAction(props),
    null as ProductFormState
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {ok ? (
        <p className="rounded-sm border border-green-200 bg-green-50 px-3 py-2 font-sans text-sm text-green-900">
          Guardado correctamente.
        </p>
      ) : null}
      {state?.error ? (
        <p className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 font-sans text-sm text-red-800">
          {state.error}
        </p>
      ) : null}

      {props.mode === "create" ? (
        <AdminField label="ID del producto (URL, no se puede cambiar después)">
          <AdminInput
            name="id"
            required
            pattern="[a-z0-9-]+"
            placeholder="comedor-raiz-viva"
            variant="mono"
          />
        </AdminField>
      ) : (
        <div>
          <span className={ADMIN_LABEL_CLASS}>ID</span>
          <code className="rounded-sm bg-charcoal/5 px-3 py-2 font-mono text-sm">
            {initial!.id}
          </code>
        </div>
      )}

      <AdminField label="Categoría">
        <AdminSelect
          name="categorySlug"
          required
          defaultValue={
            props.mode === "edit"
              ? initial?.categorySlug
              : defaultCategorySlug ?? ""
          }
        >
          <option value="">— Elegir —</option>
          {props.categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      <AdminField label="Nombre">
        <AdminInput name="name" required defaultValue={initial?.name} />
      </AdminField>

      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField label="Precio principal">
          <AdminInput name="price" defaultValue={initial?.price} />
          <p className="mt-1 font-sans text-xs text-warm-gray">
            Se muestra cuando no hay variantes de medida o como referencia.
          </p>
        </AdminField>
        <AdminField label="Dimensiones">
          <AdminInput name="dimensions" defaultValue={initial?.dimensions} />
        </AdminField>
      </div>

      <ProductSizesField defaultSizes={initial?.sizes} />

      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField label="Madera">
          <AdminInput name="wood" defaultValue={initial?.wood} />
        </AdminField>
        <AdminField label="Badge madera">
          <AdminInput name="woodBadge" defaultValue={initial?.woodBadge} />
        </AdminField>
      </div>

      <AdminField label="Descripción corta">
        <AdminTextarea
          name="shortDescription"
          rows={2}
          defaultValue={initial?.shortDescription}
        />
      </AdminField>

      <AdminField label="Descripción larga">
        <AdminTextarea
          name="description"
          rows={6}
          defaultValue={initial?.description}
        />
      </AdminField>

      <AdminField label="Acabado">
        <AdminInput name="finish" defaultValue={initial?.finish} />
      </AdminField>

      <AdminImageField
        name="image"
        label="Imagen principal"
        defaultValue={initial?.image}
        required
      />

      <AdminGalleryField defaultLines={initial?.gallery ?? []} />

      <AdminField label="Características — una por línea">
        <AdminTextarea
          name="features"
          rows={6}
          required
          defaultValue={initial?.features.join("\n")}
        />
      </AdminField>

      <button
        type="submit"
        className="rounded-sm bg-charcoal px-6 py-3 font-sans text-[0.68rem] font-medium uppercase tracking-[0.18em] text-cream hover:bg-charcoal-light"
      >
        {props.mode === "create" ? "Crear producto" : "Guardar cambios"}
      </button>
    </form>
  );
}
