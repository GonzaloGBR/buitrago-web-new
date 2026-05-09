import Link from "next/link";
import LogoMark from "@/components/LogoMark";

/** Barra superior en páginas públicas fuera de la home (categorías, etc.). */
export default function PublicTopNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-sand/30 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4 md:px-10">
        <Link
          href="/"
          aria-label="Buitrago — inicio"
          className="flex shrink-0 items-center"
        >
          <LogoMark
            variant="on-light"
            className="h-[2.75rem] w-[min(9rem,36vw)] transition-[background-color] sm:h-[3.25rem] sm:w-[min(12rem,40vw)] md:h-[4rem] md:w-[17rem]"
          />
        </Link>
        <div className="flex items-center gap-3 text-[0.62rem] sm:gap-6 sm:text-[0.7rem]">
          <Link
            href="/"
            className="hidden font-sans uppercase tracking-[0.18em] text-charcoal/70 no-underline transition-colors hover:text-charcoal sm:inline-block sm:tracking-[0.2em]"
          >
            Inicio
          </Link>
          <Link
            href="/#colección"
            className="font-sans uppercase tracking-[0.18em] text-charcoal/70 no-underline transition-colors hover:text-charcoal sm:tracking-[0.2em]"
          >
            Muebles
          </Link>
          <Link
            href="/contacto"
            className="font-sans uppercase tracking-[0.18em] text-charcoal/70 no-underline transition-colors hover:text-charcoal sm:tracking-[0.2em]"
          >
            Contacto
          </Link>
        </div>
      </div>
    </nav>
  );
}
