"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { assertAdmin } from "@/app/admin/actions/guard";
import { isR2Enabled, putPublicObject } from "@/lib/r2";

const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function uploadProductImage(formData: FormData) {
  await assertAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "Selecciona un archivo." };
  }
  const ext = MIME_EXT[file.type];
  if (!ext) {
    return { ok: false as const, error: "Solo JPG, PNG, WebP o GIF." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false as const, error: "Máximo 8 MB." };
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const name = `${randomUUID()}${ext}`;
  const key = `uploads/${name}`;

  if (isR2Enabled()) {
    try {
      const url = await putPublicObject(key, buf, file.type);
      return { ok: true as const, url };
    } catch (e) {
      console.error(e);
      return { ok: false as const, error: "Error al subir a almacenamiento (R2)." };
    }
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buf);
  return { ok: true as const, url: `/uploads/${name}` };
}
