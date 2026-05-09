"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import {
  createCategoryAction,
  updateCategoryAction,
  type CategoryFormState,
} from "@/app/admin/actions/categories";
import AdminImageField from "@/components/admin/AdminImageField";
import {
  ADMIN_LABEL_CLASS,
  AdminField,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminFormControls";

type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
};

type Props =
  | { mode: "create" }
  | { mode: "edit"; initial: Category };

export default function CategoryForm(props: Props) {
  const searchParams = useSearchParams();
  const ok = searchParams.get("ok");

  const [state, formAction] = useActionState(
    props.mode === "create"
      ? createCategoryAction
      : updateCategoryAction.bind(null, props.initial.slug),
    null as CategoryFormState
  );

  const initial = props.mode === "edit" ? props.initial : null;

  return (
    <form action={formAction} className="max-w-xl space-y-6">
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
        <AdminField label="Slug (URL) — no se puede cambiar después">
          <AdminInput
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            placeholder="mesas-de-comedor"
            variant="mono"
          />
        </AdminField>
      ) : (
        <div>
          <span className={ADMIN_LABEL_CLASS}>Slug (solo lectura)</span>
          <code className="rounded-sm bg-charcoal/5 px-3 py-2 font-mono text-sm text-charcoal">
            {initial!.slug}
          </code>
        </div>
      )}

      <AdminField label="Nombre">
        <AdminInput name="name" required defaultValue={initial?.name} />
      </AdminField>

      <AdminField label="Tagline">
        <AdminInput name="tagline" defaultValue={initial?.tagline} />
      </AdminField>

      <AdminField label="Descripción">
        <AdminTextarea
          name="description"
          rows={4}
          defaultValue={initial?.description}
        />
      </AdminField>

      <AdminImageField
        name="image"
        label="Imagen (ruta o sube archivo)"
        defaultValue={initial?.image}
        required
      />

      <button
        type="submit"
        className="rounded-sm bg-charcoal px-6 py-3 font-sans text-[0.68rem] font-medium uppercase tracking-[0.18em] text-cream hover:bg-charcoal-light"
      >
        {props.mode === "create" ? "Crear categoría" : "Guardar cambios"}
      </button>
    </form>
  );
}
