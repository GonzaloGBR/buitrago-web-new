"use client";

import { useActionState } from "react";
import {
  saveSiteContentAction,
  type SiteContentFormState,
} from "@/app/admin/actions/site-content";
import AdminImageField from "@/components/admin/AdminImageField";
import {
  MOODBOARD_COLLAGE_ADMIN_LABELS,
  MOODBOARD_COLLAGE_KEYS,
} from "@/lib/moodboard-collage";
import {
  SITE_CONTENT_DEFAULTS,
  type SiteContentValues,
} from "@/lib/site-content-defaults";

type Props = {
  initial: SiteContentValues;
};

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-xs leading-relaxed text-warm-gray">{children}</p>
  );
}

function FormSection({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-lg border border-charcoal/10 bg-white shadow-sm"
    >
      <div className="border-b border-charcoal/8 bg-charcoal/[0.02] px-5 py-4 sm:px-6">
        <h2 className="font-serif text-xl text-charcoal">{title}</h2>
        <p className="mt-1.5 max-w-2xl font-sans text-sm leading-relaxed text-warm-gray">
          {lead}
        </p>
      </div>
      <div className="space-y-8 px-5 py-6 sm:px-6 sm:py-8">{children}</div>
    </section>
  );
}

function DefaultHint({ url }: { url: string }) {
  return (
    <FieldHint>
      Si dejás el campo vacío al guardar, se usa el valor por defecto:{" "}
      <code className="mt-1 block break-all rounded bg-charcoal/5 px-1.5 py-1 font-mono text-[0.65rem] text-charcoal/70">
        {url}
      </code>
    </FieldHint>
  );
}

export default function SiteImagesForm({ initial }: Props) {
  const [state, formAction] = useActionState(
    saveSiteContentAction,
    null as SiteContentFormState
  );
  const d = SITE_CONTENT_DEFAULTS;

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {state?.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800">
          {state.error}
        </p>
      ) : null}

      <div className="rounded-md border border-charcoal/10 bg-cream px-4 py-3 font-sans text-sm leading-relaxed text-warm-gray">
        <strong className="font-medium text-charcoal">Cómo elegir fotos:</strong> subí un
        archivo nuevo, usá «Elegir imagen subida» para reutilizar cualquier foto del sitio, o
        pegá una URL. Los cambios se ven al recargar el inicio (F5 en la home).
      </div>

      <nav
        className="flex flex-wrap gap-2 font-sans text-xs"
        aria-label="Ir a sección del formulario"
      >
        {[
          ["#entrada", "Pantalla de carga"],
          ["#inicio", "Inicio"],
          ["#conocer-mas", "Conocer más"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="rounded-full border border-charcoal/15 bg-white px-3 py-1 text-charcoal/75 hover:border-charcoal/30 hover:text-charcoal"
          >
            {label}
          </a>
        ))}
      </nav>

      <FormSection
        id="entrada"
        title="Pantalla de carga (entrada al sitio)"
        lead="Primero aparece el logo con el porcentaje; después las seis fotos del collage, una encima de otra, hasta revelar el hero."
      >
        <div className="space-y-2">
          <AdminImageField
            name="homeHeroImage"
            label="Foto final — hero de fondo (tarjeta 6 del collage)"
            defaultValue={initial.homeHeroImage}
          />
          <DefaultHint url={d.homeHeroImage} />
        </div>

        <div className="border-t border-charcoal/10 pt-8">
          <h3 className="font-sans text-sm font-medium text-charcoal">
            Collage — tarjetas 1 a 5
          </h3>
          <p className="mt-1 font-sans text-xs text-warm-gray">
            Orden de aparición en la animación. La tarjeta 6 es siempre la misma imagen que el
            hero de arriba.
          </p>
          <ol className="mt-6 space-y-8">
            {MOODBOARD_COLLAGE_KEYS.map((key, i) => (
              <li key={key} className="space-y-2">
                <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.12em] text-warm-gray">
                  {i + 1} de 5
                </span>
                <AdminImageField
                  name={key}
                  label={MOODBOARD_COLLAGE_ADMIN_LABELS[i]}
                  defaultValue={initial[key]}
                />
                <DefaultHint url={d[key]} />
              </li>
            ))}
          </ol>
        </div>
      </FormSection>

      <FormSection
        id="inicio"
        title="Página de inicio (después de la carga)"
        lead="Contenido que queda visible una vez termina la animación de entrada."
      >
        <div className="space-y-2">
          <AdminImageField
            name="philosophyImage"
            label="Sección «Nuestra filosofía»"
            defaultValue={initial.philosophyImage}
          />
          <DefaultHint url={d.philosophyImage} />
        </div>
      </FormSection>

      <FormSection
        id="conocer-mas"
        title="Página «Conocer más»"
        lead="Cuatro ubicaciones independientes; podés repetir la misma foto o usar una distinta en cada bloque."
      >
        {(
          [
            ["conocerMasHeroImage", "1. Cabecera — hero «Nuestra historia»"],
            ["conocerMasStoryImage", "2. Bloque «Origen» — imagen al lado del texto"],
            ["conocerMasProcesoImage", "3. Columna «El proceso» — foto junto a los pasos"],
            ["conocerMasCtaImage", "4. Cierre — fondo de «El siguiente paso»"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-2 border-t border-charcoal/10 pt-8 first:border-0 first:pt-0">
            <AdminImageField
              name={key}
              label={label}
              defaultValue={initial[key]}
            />
            <DefaultHint url={d[key]} />
          </div>
        ))}
      </FormSection>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-4 rounded-lg border border-charcoal/10 bg-cream/95 px-4 py-3 shadow-md backdrop-blur-sm">
        <button
          type="submit"
          className="rounded-sm bg-charcoal px-6 py-3 font-sans text-[0.68rem] font-medium uppercase tracking-[0.18em] text-cream hover:bg-charcoal-light"
        >
          Guardar todas las imágenes
        </button>
        <p className="font-sans text-xs text-warm-gray">
          Un solo guardado actualiza la pantalla de carga, el inicio y «Conocer más».
        </p>
      </div>
    </form>
  );
}
