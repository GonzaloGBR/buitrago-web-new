import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  createWoodSpeciesAction,
  deleteWoodSpeciesAction,
  updateWoodSpeciesLabelAction,
} from "@/app/admin/actions/wood-species";
import {
  AdminField,
  AdminInput,
} from "@/components/admin/AdminFormControls";

type Search = Record<string, string | string[] | undefined>;

function flashMessage(sp: Search): string | null {
  if (sp.ok === "1") return "Cambios guardados.";
  if (sp.deleted === "1") return "Eliminado correctamente.";
  if (sp.error === "validation") return "Completá slug y nombre.";
  if (sp.error === "slug") return "Slug inválido (solo minúsculas, números y guiones).";
  if (sp.error === "duplicate") return "Ese slug ya existe.";
  if (sp.error === "delete") return "No se pudo eliminar.";
  if (sp.error === "save") return "No se pudo guardar.";
  return null;
}

export default async function AdminMaderasPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const flash = flashMessage(sp);

  let rows: { id: number; slug: string; label: string; position: number }[] = [];
  let dbError = false;
  try {
    rows = await prisma.woodSpecies.findMany({
      orderBy: [{ position: "asc" }, { id: "asc" }],
    });
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 font-sans text-sm text-warm-gray">
          <Link href="/admin" className="text-charcoal underline-offset-2 hover:underline">
            ← Panel
          </Link>
        </p>
        <h1 className="font-serif text-3xl text-charcoal">Maderas (catálogo)</h1>
        <p className="mt-2 max-w-xl font-sans text-sm text-warm-gray">
          Opciones globales para la ficha de producto. No se duplican por mueble: una fila por
          madera. El cliente elige en el desplegable y la elección va en el mensaje de WhatsApp.
        </p>
      </div>

      {dbError ? (
        <p className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950">
          No se pudo leer la tabla. Ejecutá{" "}
          <code className="rounded bg-white/80 px-1 font-mono text-xs">npx prisma migrate deploy</code>{" "}
          (o <code className="font-mono text-xs">db push</code>) y{" "}
          <code className="font-mono text-xs">npm run db:seed</code>.
        </p>
      ) : null}

      {flash ? (
        <p
          className={`rounded-sm border px-4 py-3 font-sans text-sm ${
            String(sp.error ?? "").length > 0
              ? "border-red-200 bg-red-50 text-red-900"
              : "border-green-200 bg-green-50 text-green-900"
          }`}
        >
          {flash}
        </p>
      ) : null}

      <section className="rounded-sm border border-charcoal/10 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl text-charcoal">Añadir madera</h2>
        <form action={createWoodSpeciesAction} className="mt-4 grid max-w-lg gap-4 sm:grid-cols-2">
          <AdminField label="Slug (URL interno)" htmlFor="new-wood-slug">
            <AdminInput
              id="new-wood-slug"
              name="slug"
              required
              placeholder="cedro"
              variant="mono"
            />
          </AdminField>
          <AdminField label="Nombre visible" htmlFor="new-wood-label">
            <AdminInput id="new-wood-label" name="label" required placeholder="Cedro" />
          </AdminField>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-sm bg-charcoal px-5 py-2.5 font-sans text-[0.68rem] font-medium uppercase tracking-[0.16em] text-cream hover:bg-charcoal-light"
            >
              Añadir
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-sm border border-charcoal/10 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl text-charcoal">Listado</h2>
        {rows.length === 0 && !dbError ? (
          <p className="mt-4 font-sans text-sm text-warm-gray">
            No hay maderas cargadas. Añadí arriba o ejecutá el seed.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-charcoal/10">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-col gap-4 py-4 first:pt-0 md:flex-row md:items-end md:justify-between">
                <form
                  action={updateWoodSpeciesLabelAction}
                  className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end"
                >
                  <input type="hidden" name="id" value={row.id} />
                  <div className="font-mono text-xs text-warm-gray">
                    <span className="text-[0.65rem] uppercase tracking-wider">Slug</span>
                    <div className="text-charcoal">{row.slug}</div>
                  </div>
                  <AdminField label="Nombre" htmlFor={`label-${row.id}`} className="min-w-[12rem] flex-1">
                    <AdminInput
                      id={`label-${row.id}`}
                      name="label"
                      required
                      defaultValue={row.label}
                    />
                  </AdminField>
                  <button
                    type="submit"
                    className="h-fit rounded-sm border border-charcoal/20 bg-white px-4 py-2 font-sans text-xs uppercase tracking-wider text-charcoal hover:border-charcoal/40"
                  >
                    Guardar nombre
                  </button>
                </form>
                <form action={deleteWoodSpeciesAction} className="shrink-0">
                  <input type="hidden" name="id" value={row.id} />
                  <button
                    type="submit"
                    className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 font-sans text-xs text-red-800 hover:bg-red-100"
                  >
                    Eliminar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
