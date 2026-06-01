import sharp from "sharp";

export type ProcessedUpload = {
  /** URL principal recomendada (WebP sRGB, máxima compatibilidad). */
  primary: Buffer;
  primaryExt: ".webp";
  primaryMime: "image/webp";
  /** Variante AVIF opcional (misma clave base). */
  avif?: Buffer;
};

/**
 * Normaliza fotos de producto a sRGB y genera WebP + AVIF.
 * Evita dominantes lavados/verdosos por perfiles ICC raros en navegadores distintos.
 */
export async function processUploadImage(input: Buffer): Promise<ProcessedUpload> {
  const base = sharp(input, { failOn: "warning" }).rotate().toColorspace("srgb");

  const [primary, avif] = await Promise.all([
    base
      .clone()
      .webp({ quality: 82, effort: 4, smartSubsample: true })
      .toBuffer(),
    base
      .clone()
      .avif({ quality: 55, effort: 6, chromaSubsampling: "4:4:4" })
      .toBuffer(),
  ]);

  return {
    primary,
    primaryExt: ".webp",
    primaryMime: "image/webp",
    avif,
  };
}
