"use server";

import { assertAdmin } from "@/app/admin/actions/guard";
import {
  listAllSiteImages,
  type AllSiteImagesResult,
} from "@/lib/catalog-images";

export type AllSiteImagesActionResult =
  | { ok: true; data: AllSiteImagesResult }
  | { ok: false; error: string };

export async function fetchAllSiteImagesAction(): Promise<AllSiteImagesActionResult> {
  await assertAdmin();
  try {
    const data = await listAllSiteImages();
    return { ok: true, data };
  } catch {
    return { ok: false, error: "No se pudieron cargar las imágenes." };
  }
}
