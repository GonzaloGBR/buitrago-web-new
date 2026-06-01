import type { CSSProperties } from "react";
import { r2Asset } from "@/lib/r2-public";

import Image from "next/image";
import { shouldUnoptimizeImage } from "@/lib/image-url";

/** Logo por defecto en R2 (`logo.png`). */
const LOGO_SRC = r2Asset("logo.png");

/** Solo medidas (sin transición), p. ej. al volver al hero sin “fade” del color. */
export const LOGO_MARK_SIZE_ONLY_CLASS =
  "h-[5rem] w-[min(23rem,calc(100vw-6.5rem))] sm:h-[5.35rem] md:h-[5.85rem] md:w-[min(28rem,calc(100vw-8rem))]";

/** Mismo tamaño en navbar, preloader y cualquier otro uso. */
export const LOGO_MARK_SIZE_CLASS = `${LOGO_MARK_SIZE_ONLY_CLASS} transition-[opacity,filter] duration-500`;

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

function isRemoteAsset(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

type LogoMarkProps = {
  /** Sobre fondo oscuro (hero / preloader): ajuste de contraste para marcas oscuras */
  variant: "on-dark" | "on-light";
  className?: string;
  src?: string;
};

/**
 * Logo de marca.
 *
 * - URLs remotas (R2, CDN): `<Image>` — `mask-image` cross-origin suele no pintar nada por CORS.
 * - Rutas locales (`/…`): máscara CSS + color de fondo (silueta tipo “B”).
 */
export default function LogoMark({ variant, className = "", src = LOGO_SRC }: LogoMarkProps) {
  if (isRemoteAsset(src)) {
    return (
      <span
        className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
        aria-hidden
      >
        <Image
          src={src}
          alt=""
          width={420}
          height={160}
          className={`max-h-full w-auto max-w-full object-contain object-center ${
            variant === "on-dark"
              ? "brightness-0 invert contrast-105 drop-shadow-[0_0_1px_rgba(0,0,0,0.95)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]"
              : ""
          }`}
          priority
          unoptimized={shouldUnoptimizeImage(src)}
        />
      </span>
    );
  }

  return (
    <span
      className={`block shrink-0 ${variant === "on-dark" ? "bg-cream" : "bg-charcoal"} ${className}`}
      style={logoMarkMaskStyle(src)}
      aria-hidden
    />
  );
}
