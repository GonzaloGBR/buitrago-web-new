import Link from "next/link";
import { logoutAction } from "@/app/admin/actions/auth";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-cream/95 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <Link href="/admin" className="font-serif text-base text-charcoal sm:text-lg">
            Buitrago — Admin
          </Link>
          <nav className="-mx-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.82rem] text-charcoal/80 sm:gap-5 sm:text-sm">
            <Link href="/admin" className="hover:text-charcoal">
              Inicio
            </Link>
            <Link href="/admin/categories" className="hover:text-charcoal">
              Categorías
            </Link>
            <Link href="/admin/products" className="hover:text-charcoal">
              Productos
            </Link>
            <Link href="/admin/featured" className="hover:text-charcoal">
              Destacados
            </Link>
            <Link href="/" className="text-warm-gray hover:text-charcoal">
              Ver sitio
            </Link>
            <form action={logoutAction} className="inline">
              <button
                type="submit"
                className="text-warm-gray hover:text-charcoal"
              >
                Salir
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">{children}</div>
    </div>
  );
}
