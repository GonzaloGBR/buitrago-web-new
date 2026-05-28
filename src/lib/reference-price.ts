/**
 * Precio “público” opcional: vacío o "—" implica cotización solo por WhatsApp.
 */
export function hasReferencePrice(price: string | undefined | null): boolean {
  const t = (price ?? "").trim();
  return t.length > 0 && t !== "—";
}

/** Etiqueta en grillas: precio de referencia o "Consultar" si no hay. */
export function getProductListPriceLabel(price: string | undefined | null): string {
  return hasReferencePrice(price) ? (price ?? "").trim() : "Consultar";
}
