"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/app/admin/actions/guard";

function isValidSlug(s: string): boolean {
  return /^[a-z0-9_-]+$/.test(s);
}

async function revalidateProductPages() {
  const rows = await prisma.product.findMany({
    select: { categorySlug: true, id: true },
  });
  for (const p of rows) {
    revalidatePath(`/categoria/${p.categorySlug}/${p.id}`);
  }
}

export async function createWoodSpeciesAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const label = String(formData.get("label") ?? "").trim();
  if (!slug || !label) redirect("/admin/maderas?error=validation");
  if (!isValidSlug(slug)) redirect("/admin/maderas?error=slug");
  const last = await prisma.woodSpecies.findFirst({ orderBy: { position: "desc" } });
  const position = (last?.position ?? -1) + 1;
  try {
    await prisma.woodSpecies.create({ data: { slug, label, position } });
  } catch {
    redirect("/admin/maderas?error=duplicate");
  }
  await revalidateProductPages();
  redirect("/admin/maderas?ok=1");
}

export async function deleteWoodSpeciesAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) {
    redirect("/admin/maderas?error=delete");
  }
  try {
    await prisma.woodSpecies.delete({ where: { id } });
  } catch {
    redirect("/admin/maderas?error=delete");
  }
  await revalidateProductPages();
  redirect("/admin/maderas?deleted=1");
}

export async function updateWoodSpeciesLabelAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = Number(formData.get("id"));
  const label = String(formData.get("label") ?? "").trim();
  if (!Number.isFinite(id) || !label) redirect("/admin/maderas?error=validation");
  try {
    await prisma.woodSpecies.update({ where: { id }, data: { label } });
  } catch {
    redirect("/admin/maderas?error=save");
  }
  await revalidateProductPages();
  redirect("/admin/maderas?ok=1");
}
