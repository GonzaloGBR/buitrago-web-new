import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client, publicUrlForKey } from "@/lib/r2";

export type PresignedUpload = {
  /** URL para PUT desde el navegador (Content-Type debe coincidir). */
  uploadUrl: string;
  /** Key en el bucket. */
  key: string;
  /** URL pública tras la subida. */
  publicUrl: string;
};

/**
 * Genera una URL firmada PUT para subir directamente a R2 (CORS debe permitir el origen del sitio).
 * El panel admin actual usa subida vía servidor (`upload.ts`); este helper queda para integraciones
 * o clientes pesados que prefieran bypass del límite de Server Actions.
 */
export async function createPresignedPut(
  key: string,
  contentType: string,
  expiresInSeconds = 900
): Promise<PresignedUpload> {
  const client = getR2Client();
  const cmd = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(client, cmd, { expiresIn: expiresInSeconds });
  return { uploadUrl, key, publicUrl: publicUrlForKey(key) };
}
