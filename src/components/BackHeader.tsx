"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoMark from "@/components/LogoMark";

/**
 * Header minimal reutilizable para páginas internas donde NO queremos el menú completo
 * (Contacto, Conocer más, etc.): solo el logo + un botón "Volver atrás".
 *
 * Usa `router.back()` para que el navegador restaure la posición de scroll exacta desde donde
 * el usuario pulsó el link que llegó aquí. Si no hay historial previo (entrada directa por URL),
 * cae a `/` para no dejar al usuario atrapado.
 */
export default function BackHeader() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-sand/30 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 md:px-10">
        <Link
          href="/"
          aria-label="Buitrago — inicio"
          className="inline-flex shrink-0 items-center"
        >
          <LogoMark
            variant="on-light"
            className="h-[2.75rem] w-[min(9rem,38vw)] sm:h-[3.5rem] sm:w-[min(14rem,45vw)] md:h-[4rem] md:w-[17rem]"
          />
        </Link>

        <button
          type="button"
          onClick={handleBack}
          aria-label="Volver atrás"
          className="group inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-charcoal/20 bg-transparent px-3.5 py-1.5 text-[0.6rem] uppercase tracking-[0.18em] text-charcoal/70 transition-colors duration-300 hover:border-charcoal/60 hover:text-charcoal sm:gap-2.5 sm:px-4 sm:py-2 sm:text-label sm:tracking-[0.2em] md:px-5 md:py-2.5"
        >
          <span
            aria-hidden
            className="text-sm leading-none transition-transform duration-300 group-hover:-translate-x-0.5 sm:text-base"
          >
            ←
          </span>
          <span className="hidden sm:inline">Volver atrás</span>
          <span className="sm:hidden">Volver</span>
        </button>
      </div>
    </header>
  );
}
