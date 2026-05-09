"use client";

import { useActionState } from "react";
import {
  saveSiteContentAction,
  type SiteContentFormState,
} from "@/app/admin/actions/site-content";
import AdminImageField from "@/components/admin/AdminImageField";
import {
  SITE_CONTENT_DEFAULTS,
  type SiteContentValues,
} from "@/lib/site-content-defaults";

type Props = {
  /** URLs en uso (resueltas con valores por defecto si la BD está vacía). */
  initial: SiteContentValues;
};

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-xs leading-relaxed text-warm-gray">{children}</p>
  );
}

export default function SiteImagesForm({ initial }: Props) {
  const [state, formAction] = useActionState(
    saveSiteContentAction,
    null as SiteContentFormState
  );
  const d = SITE_CONTENT_DEFAULTS;

  return (
    <form action={formAction} className="max-w-2xl space-y-10">
      {state?.error ? (
        <p className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 font-sans text-sm text-red-800">
          {state.error}
        </p>
      ) : null}

      <p className="rounded-sm border border-charcoal/10 bg-charcoal/[0.03] px-4 py-3 font-sans text-sm text-warm-gray">
        Subí archivos o pegá la URL pública (R2, CDN o{" "}
        <code className="rounded bg-charcoal/5 px-1 font-mono text-[0.7rem]">
          /ruta-en-public
        </code>
        ). Si borrás el texto de un campo y guardás, el sitio vuelve al valor
        por defecto del tema.
      </p>

      <section className="rounded-lg border border-charcoal/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-xl text-charcoal sm:text-2xl">
          Página de inicio
        </h2>
        <p className="mt-2 font-sans text-sm text-warm-gray">
          Hero a pantalla completa y la imagen de la sección «Nuestra filosofía»
          (enlace a Conocer más).
        </p>

        <div className="mt-8 space-y-8 border-t border-charcoal/10 pt-8">
          <div className="space-y-2">
            <AdminImageField
              name="homeHeroImage"
              label="Hero — imagen de fondo"
              defaultValue={initial.homeHeroImage}
            />
            <FieldHint>
              Por defecto:{" "}
              <code className="rounded bg-charcoal/5 px-1 font-mono text-[0.65rem]">
                {d.homeHeroImage}
              </code>
              . También se usa en la última tarjeta del collage previo al hero.
            </FieldHint>
          </div>

          <div className="space-y-2">
            <AdminImageField
              name="philosophyImage"
              label="Nuestra filosofía — foto principal"
              defaultValue={initial.philosophyImage}
            />
            <FieldHint>
              Por defecto:{" "}
              <code className="rounded bg-charcoal/5 px-1 font-mono text-[0.65rem]">
                {d.philosophyImage}
              </code>
            </FieldHint>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-charcoal/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-xl text-charcoal sm:text-2xl">
          Página «Conocer más»
        </h2>
        <p className="mt-2 font-sans text-sm text-warm-gray">
          Cuatro ubicaciones distintas: podés usar la misma foto en varias o
          cambiar cada una.
        </p>

        <div className="mt-8 space-y-8 border-t border-charcoal/10 pt-8">
          <div className="space-y-2">
            <AdminImageField
              name="conocerMasHeroImage"
              label="1. Hero — cabecera «Nuestra historia»"
              defaultValue={initial.conocerMasHeroImage}
            />
            <FieldHint>
              Por defecto:{" "}
              <code className="rounded bg-charcoal/5 px-1 font-mono text-[0.65rem]">
                {d.conocerMasHeroImage}
              </code>
            </FieldHint>
          </div>

          <div className="space-y-2">
            <AdminImageField
              name="conocerMasStoryImage"
              label="2. Bloque «Origen» — imagen al lado del texto"
              defaultValue={initial.conocerMasStoryImage}
            />
            <FieldHint>
              Por defecto:{" "}
              <code className="rounded bg-charcoal/5 px-1 font-mono text-[0.65rem]">
                {d.conocerMasStoryImage}
              </code>
            </FieldHint>
          </div>

          <div className="space-y-2">
            <AdminImageField
              name="conocerMasProcesoImage"
              label="3. Columna «El proceso» — foto fija junto a los pasos"
              defaultValue={initial.conocerMasProcesoImage}
            />
            <FieldHint>
              Por defecto:{" "}
              <code className="rounded bg-charcoal/5 px-1 font-mono text-[0.65rem]">
                {d.conocerMasProcesoImage}
              </code>
            </FieldHint>
          </div>

          <div className="space-y-2">
            <AdminImageField
              name="conocerMasCtaImage"
              label="4. Cierre — imagen de fondo del bloque «El siguiente paso»"
              defaultValue={initial.conocerMasCtaImage}
            />
            <FieldHint>
              Por defecto:{" "}
              <code className="rounded bg-charcoal/5 px-1 font-mono text-[0.65rem]">
                {d.conocerMasCtaImage}
              </code>
            </FieldHint>
          </div>
        </div>
      </section>

      <button
        type="submit"
        className="rounded-sm bg-charcoal px-6 py-3 font-sans text-[0.68rem] font-medium uppercase tracking-[0.18em] text-cream hover:bg-charcoal-light"
      >
        Guardar imágenes del sitio
      </button>
    </form>
  );
}
