"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { assertAdmin } from "@/app/admin/actions/guard";
import { processUploadImage } from "@/lib/process-upload-image";
import { isR2Enabled, publicUrlForKey, putPublicObject } from "@/lib/r2";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function uploadProductImage(formData: FormData) {
  await assertAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "Selecciona un archivo." };
  }
  if (!ALLOWED.has(file.type)) {
    return {
      ok: false as const,
      error: "Solo JPG, PNG, WebP, GIF o AVIF.",
    };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false as const, error: "Máximo 8 MB." };
  }

  const raw = Buffer.from(await file.arrayBuffer());
  let processed;
  try {
    processed = await processUploadImage(raw);
  } catch (e) {
    console.error(e);
    return {
      ok: false as const,
      error: "No se pudo procesar la imagen. Probá con otro archivo.",
    };
  }

  const id = randomUUID();
  const webpKey = `uploads/${id}.webp`;
  const avifKey = `uploads/${id}.avif`;

  if (isR2Enabled()) {
    try {
      await putPublicObject(webpKey, processed.primary, processed.primaryMime);
      if (processed.avif) {
        await putPublicObject(avifKey, processed.avif, "image/avif");
      }
      return { ok: true as const, url: publicUrlForKey(webpKey) };
    } catch (e) {
      console.error(e);
      return { ok: false as const, error: "Error al subir a almacenamiento (R2)." };
    }
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${id}.webp`), processed.primary);
  if (processed.avif) {
    await writeFile(path.join(dir, `${id}.avif`), processed.avif);
  }
  return { ok: true as const, url: `/uploads/${id}.webp` };
}
