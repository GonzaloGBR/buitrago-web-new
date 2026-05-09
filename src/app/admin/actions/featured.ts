"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/app/admin/actions/guard";

const POSITIONS = [1, 2, 3, 4] as const;

export type FeaturedFormState = { error?: string } | null;

export async function saveFeaturedProductsAction(
  _prev: FeaturedFormState,
  formData: FormData
): Promise<FeaturedFormState> {
  await assertAdmin();
  const ids = POSITIONS.map((pos) =>
    String(formData.get(`product_${pos}`) ?? "").trim()
  );
  if (ids.some((id) => !id)) {
    return { error: "Elegí un producto en cada una de las cuatro posiciones." };
  }
  if (new Set(ids).size !== ids.length) {
    return { error: "No podés repetir el mismo producto en dos posiciones." };
  }

  const found = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
  if (found.length !== 4) {
    return { error: "Uno o más productos no existen. Guardá de nuevo." };
  }

  try {
    await prisma.$transaction(
      POSITIONS.map((position, idx) =>
        prisma.featuredProduct.upsert({
          where: { position },
          create: { position, productId: ids[idx] },
          update: { productId: ids[idx] },
        })
      )
    );
  } catch {
    return { error: "No se pudo guardar. Probá de nuevo." };
  }

  revalidatePath("/");
  redirect("/admin/featured?ok=1");
}
