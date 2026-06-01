"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export type CatalogBreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  backHref: string;
  /** @deprecated No longer rendered; kept for backwards compat. */
  backLabel?: string;
  breadcrumbs: CatalogBreadcrumbItem[];
};

/**
 * Migas de pan + flecha de retorno para catálogo.
 *
 * Componente inline (sin contenedor propio) para integrarse directamente
 * dentro de la sección hero de cada página. Tipografía `text-label` con
 * warm-gray / charcoal, consistente con el sistema de diseño editorial.
 */
export default function CatalogPageHeader({
  backHref,
  breadcrumbs,
}: Props) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    const isInternal =
      typeof document !== "undefined" &&
      document.referrer.includes(window.location.host);

    if (isInternal && window.history.length > 1) {
      router.back();
    } else {
      if (backHref.includes("#")) {
        window.location.href = backHref;
      } else {
        router.push(backHref);
      }
    }
  };

  return (
    <div className="flex items-center">
      {/* Flecha de retorno */}
      <a
        href={backHref}
        onClick={handleBack}
        aria-label="Volver"
        className="mr-3 flex cursor-pointer items-center text-warm-gray/60 no-underline transition-colors duration-300 hover:text-charcoal sm:mr-4"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 sm:h-[18px] sm:w-[18px]"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </a>

      {/* Separador vertical sutil */}
      <span className="mr-3 h-3.5 w-px bg-sand/50 sm:mr-4" aria-hidden />

      {/* Breadcrumbs */}
      <nav
        aria-label="Migas de pan"
        className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-sans text-[0.6rem] uppercase tracking-[0.16em] text-warm-gray/60 sm:text-[0.65rem] sm:tracking-[0.18em]"
      >
        {breadcrumbs.map((item, i) => (
          <span key={`${item.label}-${i}`} className="inline-flex items-center gap-x-1.5">
            {i > 0 ? (
              <span className="text-sand/70" aria-hidden>/</span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="no-underline transition-colors duration-300 hover:text-charcoal"
              >
                {item.label}
              </Link>
            ) : (
              <span className="max-w-[10rem] truncate text-charcoal/70 sm:max-w-[16rem]">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
