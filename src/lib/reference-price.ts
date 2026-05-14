/**
 * Precio “público” opcional: vacío o "—" implica cotización solo por WhatsApp.
 */
export function hasReferencePrice(price: string | undefined | null): boolean {
  const t = (price ?? "").trim();
  return t.length > 0 && t !== "—";
}
