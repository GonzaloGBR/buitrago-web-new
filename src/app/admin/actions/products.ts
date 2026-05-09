"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isValidProductId } from "@/lib/slug";
import { assertAdmin } from "@/app/admin/actions/guard";
import { normalizeImageSrc } from "@/lib/image-url";

function parseFeatures(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseGallery(raw: string): string[] {
  const lines = raw.split(/\r?\n/).flatMap((l) => l.split(","));
  return lines.map((s) => normalizeImageSrc(s.trim())).filter(Boolean);
}

/** Variante de medida lista para insertarse en BD (sin productId, lo añade el caller). */
type ParsedSize = { label: string; price: string; position: number };

/**
 * Parsea las medidas que el `ProductForm` envía en un único campo `sizes` con JSON serializado:
 *   [{ "label": "140x90", "price": "$2.819.000" }, ...]
 *
 * Razones del formato JSON (en lugar de pares `sizeLabel[]` / `sizePrice[]`):
 * - Un único hidden input controlado por el cliente: imposible que se desincronicen los pares.
 * - Permite reordenar y borrar filas en el cliente sin tener que mantener N inputs sincronizados.
 *
 * Validaciones:
 * - Cada fila debe tener `label` no vacío. Filas con label vacío se descartan silenciosamente
 *   (común al añadir una fila y no llenarla).
 * - `price` se permite vacío y se sustituye por "—" para mantener coherencia con el resto del
 *   modelo (que usa "—" como placeholder cuando no hay valor).
 * - `position` se asigna por orden de llegada (0..n) para que el orden visual del admin se
 *   refleje 1:1 en la página pública.
 */
function parseSizes(raw: string): ParsedSize[] {
  if (!raw.trim()) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  const result: ParsedSize[] = [];
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const label = typeof rec.label === "string" ? rec.label.trim() : "";
    const price = typeof rec.price === "string" ? rec.price.trim() : "";
    if (!label) continue;
    result.push({
      label,
      price: price || "—",
      position: result.length,
    });
  }
  return result;
}

export type ProductFormState = { error?: string } | null;

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "").trim().toLowerCase();
  const categorySlug = String(formData.get("categorySlug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const wood = String(formData.get("wood") ?? "").trim();
  const woodBadge = String(formData.get("woodBadge") ?? "").trim();
  const dimensions = String(formData.get("dimensions") ?? "").trim();
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const finish = String(formData.get("finish") ?? "").trim();
  const image = normalizeImageSrc(String(formData.get("image") ?? "").trim());
  const features = parseFeatures(String(formData.get("features") ?? ""));
  const gallery = parseGallery(String(formData.get("gallery") ?? ""));
  const sizes = parseSizes(String(formData.get("sizes") ?? ""));

  if (!isValidProductId(id)) {
    return { error: "ID inválido (minúsculas, números y guiones)." };
  }
  if (!categorySlug || !name || !image || gallery.length === 0) {
    return { error: "Categoría, nombre, imagen principal y al menos una imagen de galería son obligatorios." };
  }
  if (features.length === 0) {
    return { error: "Añade al menos una característica (una por línea)." };
  }

  try {
    await prisma.product.create({
      data: {
        id,
        categorySlug,
        name,
        price: price || "—",
        wood: wood || "—",
        woodBadge: woodBadge || "—",
        dimensions: dimensions || "—",
        shortDescription: shortDescription || "—",
        description: description || "—",
        finish: finish || "—",
        image,
        features,
        gallery,
        // Las medidas se insertan en cascada con el producto.
        sizes: sizes.length > 0 ? { create: sizes } : undefined,
      },
    });
  } catch {
    return { error: "No se pudo crear (¿ID duplicado o categoría inexistente?)." };
  }
  revalidatePath("/");
  revalidatePath(`/categoria/${categorySlug}`);
  revalidatePath(`/categoria/${categorySlug}/${id}`);
  redirect(`/admin/products/${id}/edit?ok=1`);
}

export async function updateProductAction(
  productId: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await assertAdmin();
  const categorySlug = String(formData.get("categorySlug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const wood = String(formData.get("wood") ?? "").trim();
  const woodBadge = String(formData.get("woodBadge") ?? "").trim();
  const dimensions = String(formData.get("dimensions") ?? "").trim();
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const finish = String(formData.get("finish") ?? "").trim();
  const image = normalizeImageSrc(String(formData.get("image") ?? "").trim());
  const features = parseFeatures(String(formData.get("features") ?? ""));
  const gallery = parseGallery(String(formData.get("gallery") ?? ""));
  const sizes = parseSizes(String(formData.get("sizes") ?? ""));

  if (!categorySlug || !name || !image || gallery.length === 0) {
    return { error: "Categoría, nombre, imagen y galería son obligatorios." };
  }
  if (features.length === 0) {
    return { error: "Añade al menos una característica." };
  }

  let old: { categorySlug: string } | null = null;
  try {
    old = await prisma.product.findUnique({
      where: { id: productId },
      select: { categorySlug: true },
    });
    /**
     * Estrategia "borrar y recrear" para sizes:
     * - Las filas no tienen identidad estable a ojos del usuario (solo label/price/posición),
     *   así que detectar añadidos/editados/borrados fila a fila no aporta valor y complica el código.
     * - `deleteMany + create` dentro de la misma operación atómica garantiza consistencia.
     * - Envuelto en `$transaction` por si falla a mitad de camino.
     */
    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: {
          categorySlug,
          name,
          price: price || "—",
          wood: wood || "—",
          woodBadge: woodBadge || "—",
          dimensions: dimensions || "—",
          shortDescription: shortDescription || "—",
          description: description || "—",
          finish: finish || "—",
          image,
          features,
          gallery,
        },
      }),
      prisma.productSize.deleteMany({ where: { productId } }),
      ...(sizes.length > 0
        ? [
            prisma.productSize.createMany({
              data: sizes.map((s) => ({ ...s, productId })),
            }),
          ]
        : []),
    ]);
  } catch {
    return { error: "No se pudo guardar." };
  }
  revalidatePath("/");
  if (old) {
    revalidatePath(`/categoria/${old.categorySlug}`);
    revalidatePath(`/categoria/${old.categorySlug}/${productId}`);
  }
  revalidatePath(`/categoria/${categorySlug}`);
  revalidatePath(`/categoria/${categorySlug}/${productId}`);
  redirect(`/admin/products/${productId}/edit?ok=1`);
}

export async function deleteProductAction(
  productId: string,
  formData: FormData
): Promise<void> {
  await assertAdmin();
  const returnCategoria = String(formData.get("returnCategoria") ?? "").trim();
  let slug: string | null = null;
  try {
    const p = await prisma.product.findUnique({
      where: { id: productId },
      select: { categorySlug: true },
    });
    slug = p?.categorySlug ?? null;
    await prisma.product.delete({ where: { id: productId } });
  } catch {
    const q = returnCategoria
      ? `?error=delete&categoria=${encodeURIComponent(returnCategoria)}`
      : "?error=delete";
    redirect(`/admin/products${q}`);
  }
  revalidatePath("/");
  if (slug) {
    revalidatePath(`/categoria/${slug}`);
  }
  const keep =
    slug ?? (returnCategoria ? returnCategoria : null);
  const q = keep
    ? `?deleted=1&categoria=${encodeURIComponent(keep)}`
    : "?deleted=1";
  redirect(`/admin/products${q}`);
}
