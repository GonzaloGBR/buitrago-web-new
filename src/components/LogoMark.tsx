import type { CSSProperties } from "react";

/** Logo en máscara CSS: solo se pinta la silueta; evita rectángulo blanco de brightness/invert y el “tablero” si el PNG tiene buen canal alpha. */
const LOGO_SRC = "/logo-b-mark.png";

/** Solo medidas (sin transición), p. ej. al volver al hero sin “fade” del color. */
export const LOGO_MARK_SIZE_ONLY_CLASS =
  "h-[4.5rem] w-[min(21rem,calc(100vw-7.5rem))] md:h-[5rem] md:w-[25rem]";

/** Mismo tamaño en navbar, preloader y cualquier otro uso. */
export const LOGO_MARK_SIZE_CLASS = `${LOGO_MARK_SIZE_ONLY_CLASS} transition-[background-color] duration-500`;

export function logoMarkMaskStyle(src: string = LOGO_SRC): CSSProperties {
  return {
    maskImage: `url("${src}")`,
    WebkitMaskImage: `url("${src}")`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };
}

type LogoMarkProps = {
  /** Sobre fondo oscuro (hero / preloader): letra clara */
  variant: "on-dark" | "on-light";
  className?: string;
  src?: string;
};

export default function LogoMark({ variant, className = "", src = LOGO_SRC }: LogoMarkProps) {
  return (
    <span
      className={`block shrink-0 ${variant === "on-dark" ? "bg-cream" : "bg-charcoal"} ${className}`}
      style={logoMarkMaskStyle(src)}
      aria-hidden
    />
  );
}
