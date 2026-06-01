import CatalogImage from "@/components/CatalogImage";
import type { ImageProps } from "next/image";

type Props = Omit<ImageProps, "fill">;

/** Imagen de producto a sangre (cover), anclada al mueble para mostrar patas y base. */
export default function ProductCardImage({ className = "", ...props }: Props) {
  return (
    <CatalogImage
      {...props}
      fill
      quality={90}
      className={`object-contain object-center ${className}`.trim()}
    />
  );
}
