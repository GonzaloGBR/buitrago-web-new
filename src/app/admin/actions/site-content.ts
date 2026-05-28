"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/app/admin/actions/guard";
import { normalizeImageSrc } from "@/lib/image-url";
import { MOODBOARD_COLLAGE_KEYS } from "@/lib/moodboard-collage";
import {
  SITE_CONTENT_DEFAULTS,
  type SiteContentValues,
} from "@/lib/site-content-defaults";

export type SiteContentFormState = { error?: string } | null;

function storedFromInput(raw: string, defaultUrl: string): string {
  const n = normalizeImageSrc(raw);
  if (!n) return "";
  const def = normalizeImageSrc(defaultUrl);
  if (def && n === def) return "";
  return n;
}

function siteContentPayload(formData: FormData): SiteContentValues {
  const d = SITE_CONTENT_DEFAULTS;
  const moodboard = Object.fromEntries(
    MOODBOARD_COLLAGE_KEYS.map((key) => [
      key,
      storedFromInput(String(formData.get(key) ?? ""), d[key]),
    ])
  ) as Pick<SiteContentValues, (typeof MOODBOARD_COLLAGE_KEYS)[number]>;

  return {
    homeHeroImage: storedFromInput(
      String(formData.get("homeHeroImage") ?? ""),
      d.homeHeroImage
    ),
    ...moodboard,
    philosophyImage: storedFromInput(
      String(formData.get("philosophyImage") ?? ""),
      d.philosophyImage
    ),
    conocerMasHeroImage: storedFromInput(
      String(formData.get("conocerMasHeroImage") ?? ""),
      d.conocerMasHeroImage
    ),
    conocerMasStoryImage: storedFromInput(
      String(formData.get("conocerMasStoryImage") ?? ""),
      d.conocerMasStoryImage
    ),
    conocerMasProcesoImage: storedFromInput(
      String(formData.get("conocerMasProcesoImage") ?? ""),
      d.conocerMasProcesoImage
    ),
    conocerMasCtaImage: storedFromInput(
      String(formData.get("conocerMasCtaImage") ?? ""),
      d.conocerMasCtaImage
    ),
  };
}

export async function saveSiteContentAction(
  _prev: SiteContentFormState,
  formData: FormData
): Promise<SiteContentFormState> {
  await assertAdmin();

  try {
    const data = siteContentPayload(formData);
    await prisma.siteContent.upsert({
      where: { id: 1 },
      create: { id: 1, ...data },
      update: data,
    });
  } catch {
    return { error: "No se pudo guardar. Probá de nuevo." };
  }

  revalidatePath("/");
  revalidatePath("/conocer-mas");
  redirect("/admin/site-images?ok=1");
}
