"use client";

import { useCallback, useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import {
  getRasterFallbackSrc,
  isAvifSrc,
  isR2OrUploadsSrc,
  shouldUnoptimizeImage,
} from "@/lib/image-url";

type Props = ImageProps;

/**
 * Imágenes del catálogo y del sitio.
 * - URLs de Cloudflare R2: enlace directo + <picture> AVIF/WebP cuando aplica.
 * - Otras rutas: optimizador de Next si está disponible en el hosting.
 */
export default function CatalogImage({
  src,
  alt,
  unoptimized,
  onError,
  fill,
  className,
  priority,
  sizes,
  ...rest
}: Props) {
  const initial = String(src);
  const [resolvedSrc, setResolvedSrc] = useState(initial);
  const [triedRasterFallback, setTriedRasterFallback] = useState(false);

  useEffect(() => {
    setResolvedSrc(String(src));
    setTriedRasterFallback(false);
  }, [src]);

  const directFromR2 =
    unoptimized ?? shouldUnoptimizeImage(resolvedSrc, { triedRasterFallback });

  const webpFallback = getRasterFallbackSrc(resolvedSrc);
  const usePicture =
    directFromR2 && isR2OrUploadsSrc(resolvedSrc) && isAvifSrc(resolvedSrc) && webpFallback;

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (!triedRasterFallback && isAvifSrc(resolvedSrc)) {
        const fallback = getRasterFallbackSrc(resolvedSrc);
        if (fallback && fallback !== resolvedSrc) {
          setTriedRasterFallback(true);
          setResolvedSrc(fallback);
          return;
        }
      }
      onError?.(e);
    },
    [resolvedSrc, triedRasterFallback, onError]
  );

  if (usePicture && webpFallback) {
    const imgClass = [
      fill ? "absolute inset-0 h-full w-full" : "",
      "object-cover",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <picture className={fill ? "relative block h-full w-full" : undefined}>
        <source srcSet={resolvedSrc} type="image/avif" />
        <source srcSet={webpFallback} type="image/webp" />
        <img
          src={webpFallback}
          alt={alt ?? ""}
          className={imgClass}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
          onError={handleError}
        />
      </picture>
    );
  }

  return (
    <Image
      {...rest}
      src={resolvedSrc}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      sizes={sizes}
      unoptimized={directFromR2}
      onError={handleError}
    />
  );
}
