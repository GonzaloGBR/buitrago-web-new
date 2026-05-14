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

export async function createFinishOptionAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const label = String(formData.get("label") ?? "").trim();
  if (!slug || !label) redirect("/admin/acabados?error=validation");
  if (!isValidSlug(slug)) redirect("/admin/acabados?error=slug");
  const last = await prisma.finishOption.findFirst({ orderBy: { position: "desc" } });
  const position = (last?.position ?? -1) + 1;
  try {
    await prisma.finishOption.create({ data: { slug, label, position } });
  } catch {
    redirect("/admin/acabados?error=duplicate");
  }
  await revalidateProductPages();
  redirect("/admin/acabados?ok=1");
}

export async function deleteFinishOptionAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) {
    redirect("/admin/acabados?error=delete");
  }
  try {
    await prisma.finishOption.delete({ where: { id } });
  } catch {
    redirect("/admin/acabados?error=delete");
  }
  await revalidateProductPages();
  redirect("/admin/acabados?deleted=1");
}

export async function updateFinishOptionLabelAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = Number(formData.get("id"));
  const label = String(formData.get("label") ?? "").trim();
  if (!Number.isFinite(id) || !label) redirect("/admin/acabados?error=validation");
  try {
    await prisma.finishOption.update({ where: { id }, data: { label } });
  } catch {
    redirect("/admin/acabados?error=save");
  }
  await revalidateProductPages();
  redirect("/admin/acabados?ok=1");
}
