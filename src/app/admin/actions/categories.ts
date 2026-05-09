"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isValidSlug } from "@/lib/slug";
import { assertAdmin } from "@/app/admin/actions/guard";
import { normalizeImageSrc } from "@/lib/image-url";

function parseCreateFields(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim().toLowerCase(),
    name: String(formData.get("name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    image: normalizeImageSrc(String(formData.get("image") ?? "").trim()),
  };
}

function parseUpdateFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    image: normalizeImageSrc(String(formData.get("image") ?? "").trim()),
  };
}

export type CategoryFormState = { error?: string } | null;

export async function createCategoryAction(
  _prev: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await assertAdmin();
  const f = parseCreateFields(formData);
  if (!isValidSlug(f.slug)) {
    return { error: "Slug inválido (solo minúsculas, números y guiones)." };
  }
  if (!f.name || !f.image) {
    return { error: "Nombre e imagen son obligatorios." };
  }
  try {
    await prisma.category.create({
      data: {
        slug: f.slug,
        name: f.name,
        tagline: f.tagline || "—",
        description: f.description || "—",
        image: f.image,
      },
    });
  } catch {
    return { error: "No se pudo crear (¿el slug ya existe?)." };
  }
  revalidatePath("/");
  revalidatePath(`/categoria/${f.slug}`);
  redirect(`/admin/categories/${f.slug}/edit?ok=1`);
}

export async function updateCategoryAction(
  slug: string,
  _prev: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await assertAdmin();
  const f = parseUpdateFields(formData);
  if (!f.name || !f.image) {
    return { error: "Nombre e imagen son obligatorios." };
  }
  try {
    await prisma.category.update({
      where: { slug },
      data: {
        name: f.name,
        tagline: f.tagline || "—",
        description: f.description || "—",
        image: f.image,
      },
    });
  } catch {
    return { error: "No se pudo guardar." };
  }
  revalidatePath("/");
  revalidatePath(`/categoria/${slug}`);
  redirect(`/admin/categories/${slug}/edit?ok=1`);
}

export async function deleteCategoryAction(
  slug: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData?: FormData
): Promise<void> {
  await assertAdmin();
  try {
    await prisma.category.delete({ where: { slug } });
  } catch {
    redirect("/admin/categories?error=delete");
  }
  revalidatePath("/");
  redirect("/admin/categories?deleted=1");
}
