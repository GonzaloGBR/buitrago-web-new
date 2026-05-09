import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function r2Configured(): boolean {
  return Boolean(
    process.env.R2_ENDPOINT &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_URL
  );
}

export function isR2Enabled(): boolean {
  return r2Configured();
}

export function getR2Client(): S3Client {
  if (!r2Configured()) {
    throw new Error("R2: faltan variables de entorno (R2_ENDPOINT, credenciales, bucket, R2_PUBLIC_URL).");
  }
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

/** URL pública final del objeto (sin slash final en la base). */
export function publicUrlForKey(key: string): string {
  const base = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
  const k = key.replace(/^\//, "");
  return `${base}/${k}`;
}

export async function putPublicObject(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return publicUrlForKey(key);
}
