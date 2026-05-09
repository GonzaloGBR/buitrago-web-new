"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/app/admin/actions/guard";
import { normalizeImageSrc } from "@/lib/image-url";
import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content-defaults";

export type SiteContentFormState = { error?: string } | null;

/** Vacío en BD = usar `SITE_CONTENT_DEFAULTS`. Si pegás exactamente la URL por defecto, también guardamos vacío. */
function storedFromInput(raw: string, defaultUrl: string): string {
  const n = normalizeImageSrc(raw);
  if (!n) return "";
  const def = normalizeImageSrc(defaultUrl);
  if (def && n === def) return "";
  return n;
}

export async function saveSiteContentAction(
  _prev: SiteContentFormState,
  formData: FormData
): Promise<SiteContentFormState> {
  await assertAdmin();
  const d = SITE_CONTENT_DEFAULTS;

  try {
    await prisma.siteContent.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        homeHeroImage: storedFromInput(
          String(formData.get("homeHeroImage") ?? ""),
          d.homeHeroImage
        ),
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
      },
      update: {
        homeHeroImage: storedFromInput(
          String(formData.get("homeHeroImage") ?? ""),
          d.homeHeroImage
        ),
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
      },
    });
  } catch {
    return { error: "No se pudo guardar. Probá de nuevo." };
  }

  revalidatePath("/");
  revalidatePath("/conocer-mas");
  redirect("/admin/site-images?ok=1");
}
