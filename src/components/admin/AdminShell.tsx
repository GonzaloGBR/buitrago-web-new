"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions/auth";

type NavItem = { href: string; label: string };

type NavGroup = {
  title: string;
  description?: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Resumen",
    items: [{ href: "/admin", label: "Panel principal" }],
  },
  {
    title: "Ventas",
    description: "Gestión de clientes e ingresos",
    items: [{ href: "/admin/pedidos", label: "Información" }],
  },
  {
    title: "Catálogo",
    description: "Lo que ve el visitante en el sitio",
    items: [
      { href: "/admin/categories", label: "Categorías" },
      { href: "/admin/products", label: "Productos" },
      { href: "/admin/featured", label: "Destacados en el inicio" },
    ],
  },
  {
    title: "Opciones de producto",
    description: "Listas del formulario de cada pieza",
    items: [
      { href: "/admin/maderas", label: "Maderas" },
      { href: "/admin/acabados", label: "Acabados" },
    ],
  },
  {
    title: "Apariencia",
    description: "Fotos del inicio y pantalla de carga",
    items: [{ href: "/admin/site-images", label: "Imágenes del sitio" }],
  },
];

function navLinkClass(active: boolean) {
  return active
    ? "block rounded-md bg-charcoal px-3 py-2 font-sans text-sm text-cream"
    : "block rounded-md px-3 py-2 font-sans text-sm text-charcoal/80 transition hover:bg-charcoal/[0.06] hover:text-charcoal";
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-[#f3f1ec]">
      <header className="border-b border-charcoal/10 bg-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <Link href="/admin" className="font-serif text-lg text-charcoal sm:text-xl">
              Buitrago — Administración
            </Link>
            <p className="mt-0.5 font-sans text-xs text-warm-gray">
              Editá el catálogo y las imágenes sin tocar código
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-sans text-sm">
            <Link
              href="/"
              className="rounded-md border border-charcoal/15 bg-white px-3 py-1.5 text-charcoal/80 hover:border-charcoal/30"
            >
              Ver sitio público
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-warm-gray underline-offset-2 hover:text-charcoal hover:underline"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-10 sm:px-6">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav
            className="rounded-lg border border-charcoal/10 bg-cream p-3 shadow-sm"
            aria-label="Secciones del panel"
          >
            {NAV_GROUPS.map((group, gi) => (
              <div key={group.title} className={gi > 0 ? "mt-5 border-t border-charcoal/10 pt-5" : ""}>
                <p className="px-3 font-sans text-[0.65rem] font-medium uppercase tracking-[0.14em] text-warm-gray">
                  {group.title}
                </p>
                {group.description ? (
                  <p className="mt-1 px-3 font-sans text-[0.7rem] leading-snug text-warm-gray/90">
                    {group.description}
                  </p>
                ) : null}
                <ul className="mt-2 space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={navLinkClass(isActive(item.href))}
                        aria-current={isActive(item.href) ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
