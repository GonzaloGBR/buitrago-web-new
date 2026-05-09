import Image, { type ImageProps } from "next/image";
import { shouldUnoptimizeImage } from "@/lib/image-url";

/**
 * Imágenes del catálogo (sobre todo `/uploads/`) sin pasar por el optimizador de Next,
 * para evitar fallos en algunos hostings.
 */
export default function CatalogImage({
  src,
  alt,
  unoptimized,
  ...rest
}: ImageProps) {
  return (
    <Image
      {...rest}
      src={src}
      alt={alt}
      unoptimized={unoptimized ?? shouldUnoptimizeImage(String(src))}
    />
  );
}
