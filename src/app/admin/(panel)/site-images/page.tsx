import Link from "next/link";
import SiteImagesForm from "@/components/admin/SiteImagesForm";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AdminSiteImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const initial = await getSiteContent();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin"
          className="font-sans text-sm text-warm-gray hover:text-charcoal"
        >
          ← Volver al panel
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-charcoal">
          Imágenes del sitio
        </h1>
        <p className="mt-2 max-w-xl font-sans text-sm text-warm-gray">
          Hero del inicio, sección «Nuestra filosofía» y todas las fotos
          principales de la página «Conocer más». Los archivos nuevos se suben
          al mismo almacenamiento que el catálogo (R2 o{" "}
          <code className="rounded bg-charcoal/5 px-1 font-mono text-xs">
            /public/uploads
          </code>
          ).
        </p>
      </div>

      {ok ? (
        <p className="rounded-sm border border-green-200 bg-green-50 px-3 py-2 font-sans text-sm text-green-900">
          Cambios guardados. El inicio y «Conocer más» se actualizaron.
        </p>
      ) : null}

      <SiteImagesForm initial={initial} />
    </div>
  );
}
