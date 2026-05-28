import SiteImagesForm from "@/components/admin/SiteImagesForm";
import AdminPageHeader, { AdminFlash } from "@/components/admin/AdminPageHeader";
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
      <AdminPageHeader
        title="Imágenes del sitio"
        description="Pantalla de carga (logo, porcentaje y collage), hero y filosofía del inicio, y las cuatro fotos principales de «Conocer más»."
      />

      {ok ? (
        <AdminFlash variant="success">
          Cambios guardados. Recargá la página de inicio (F5) para ver la pantalla de carga
          actualizada.
        </AdminFlash>
      ) : null}

      <SiteImagesForm initial={initial} />
    </div>
  );
}
