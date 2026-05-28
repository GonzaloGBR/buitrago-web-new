"use client";

import { useEffect, useMemo, useState } from "react";
import CatalogImage from "@/components/CatalogImage";
import ProductCardImage from "@/components/ProductCardImage";
import Link from "next/link";
import { getProductListPriceLabel, hasReferencePrice } from "@/lib/reference-price";
import { SITE_WHATSAPP_URL } from "@/lib/site-contact";
import type { CatalogOptionRow, Category, Product, ProductSize } from "@/data/catalog";

const SELECT_CLASS =
  "w-full cursor-pointer appearance-none rounded-sm border border-charcoal bg-cream py-2.5 pl-3 pr-10 font-sans text-[0.9rem] text-charcoal shadow-none outline-none transition-[border-color,box-shadow] focus:border-charcoal focus:ring-2 focus:ring-charcoal/15 sm:py-3 sm:text-[0.95rem]";

function OptionSelectRow({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: number | "";
  onChange: (n: number) => void;
  options: { id: number; label: string }[];
}) {
  if (options.length === 0) return null;
  return (
    <div>
      <label htmlFor={id} className="text-label mb-2 block text-warm-gray">
        {label}
      </label>
      <div className="relative max-w-xs sm:max-w-sm">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={SELECT_CLASS}
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/60"
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
    </div>
  );
}

type Props = {
  slug: string;
  product: Product;
  category: Category;
  similarProducts: Product[];
  woodSpecies: CatalogOptionRow[];
  finishOptions: CatalogOptionRow[];
};

/**
 * `id` sentinela para la "variante por defecto" que construimos a partir de las dimensiones
 * del producto (y precio de referencia opcional). Negativo para no colisionar con los IDs
 * autoincrementales de `ProductSize`.
 */
const DEFAULT_VARIANT_ID = -1;

/** Normaliza una etiqueta para compararla sin distinguir mayúsculas/espacios/separadores
 *  habituales (×, x, *). Así detectamos duplicados como "210x100" vs "210×100". */
function normalizeSizeLabel(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "").replace(/[×*]/g, "x");
}

/**
 * Construye la lista de medidas que se muestran en el selector.
 *
 * Reglas:
 *  - Si el producto NO tiene variantes en BD → devolvemos []. No hay desplegable de medidas.
 *  - Si SÍ tiene variantes → anteponemos una "variante por defecto" sintética con
 *    `label = product.dimensions` y `price = product.price` (puede ser "—" si no hay precio
 *    de referencia). Así el cliente puede elegir también la medida base del producto.
 *  - Si la dimension principal está vacía / es "—", o si coincide con alguna variante,
 *    no la anteponemos.
 */
function buildDisplaySizes(product: Product): ProductSize[] {
  if (product.sizes.length === 0) return [];

  const defaultLabel = product.dimensions.trim();
  const defaultPrice = product.price.trim();
  const hasDefaultLabel =
    defaultLabel.length > 0 && defaultLabel !== "—";
  if (!hasDefaultLabel) return product.sizes;

  const defaultNorm = normalizeSizeLabel(defaultLabel);
  const alreadyPresent = product.sizes.some(
    (s) => normalizeSizeLabel(s.label) === defaultNorm
  );
  if (alreadyPresent) return product.sizes;

  const defaultRow: ProductSize = {
    id: DEFAULT_VARIANT_ID,
    label: defaultLabel,
    price: defaultPrice && defaultPrice !== "—" ? defaultPrice : "—",
    position: -1,
  };
  return [defaultRow, ...product.sizes];
}

export default function ProductDetailClient({
  slug,
  product,
  category,
  similarProducts,
  woodSpecies,
  finishOptions,
}: Props) {
  const [activeImg, setActiveImg] = useState(0);
  const [showShare, setShowShare] = useState(false);

  /**
   * Selector de variantes por medida.
   * - `displaySizes` mezcla las variantes guardadas en BD + (si corresponde) la medida
   *   "por defecto" del producto, antepuesta como primera opción.
   * - Si no hay variantes en BD no hay desplegable de medidas (las dimensiones del producto
   *   siguen en la ficha vía texto del admin).
   * - Guardamos el `id` (no el índice) para sobrevivir a reordenamientos / ediciones del admin.
   */
  const displaySizes = useMemo(() => buildDisplaySizes(product), [product]);
  const hasSizes = displaySizes.length > 0;
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(
    () => displaySizes[0]?.id ?? null
  );
  const [selectedWoodId, setSelectedWoodId] = useState<number | null>(
    () => woodSpecies[0]?.id ?? null
  );
  const [selectedFinishId, setSelectedFinishId] = useState<number | null>(
    () => finishOptions[0]?.id ?? null
  );
  const selectedSize =
    displaySizes.find((s) => s.id === selectedSizeId) ?? displaySizes[0] ?? null;

  useEffect(() => {
    setSelectedSizeId((prev) => {
      if (prev != null && displaySizes.some((s) => s.id === prev)) return prev;
      return displaySizes[0]?.id ?? null;
    });
  }, [displaySizes]);

  useEffect(() => {
    setSelectedWoodId((prev) => {
      if (prev != null && woodSpecies.some((w) => w.id === prev)) return prev;
      return woodSpecies[0]?.id ?? null;
    });
  }, [woodSpecies]);

  useEffect(() => {
    setSelectedFinishId((prev) => {
      if (prev != null && finishOptions.some((f) => f.id === prev)) return prev;
      return finishOptions[0]?.id ?? null;
    });
  }, [finishOptions]);

  const rawReferencePrice = (selectedSize?.price ?? product.price).trim();
  const referencePriceText = hasReferencePrice(rawReferencePrice)
    ? rawReferencePrice
    : null;
  const displayDimensions = selectedSize?.label ?? product.dimensions;
  const selectedWoodLabel =
    woodSpecies.find((w) => w.id === selectedWoodId)?.label ?? null;
  const selectedFinishLabel =
    finishOptions.find((f) => f.id === selectedFinishId)?.label ?? null;

  useEffect(() => {
    if (showShare) {
      const t = setTimeout(() => setShowShare(false), 2500);
      return () => clearTimeout(t);
    }
  }, [showShare]);

  const whatsappMessage = useMemo(() => {
    const parts = [
      `Hola, me interesa cotizar "${product.name}".`,
      selectedWoodLabel ? `Madera: ${selectedWoodLabel}.` : "",
      selectedFinishLabel ? `Acabado: ${selectedFinishLabel}.` : "",
      `Medidas: ${displayDimensions}.`,
      referencePriceText
        ? `Precio de referencia (orientativo): ${referencePriceText}.`
        : "",
      "¿Podrían armarme un presupuesto?",
    ].filter(Boolean);
    return encodeURIComponent(parts.join(" "));
  }, [
    product.name,
    selectedWoodLabel,
    selectedFinishLabel,
    displayDimensions,
    referencePriceText,
  ]);
  const whatsappUrl = `${SITE_WHATSAPP_URL}?text=${whatsappMessage}`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShowShare(true);
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <div className="section-editorial pt-5 pb-2 sm:pt-6">
        <Link
          href={`/categoria/${slug}`}
          className="inline-flex items-center gap-2 font-sans text-[0.72rem] text-charcoal/60 no-underline transition-colors hover:text-charcoal sm:gap-2.5 sm:text-[0.8rem]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-charcoal/15 text-[0.8rem] sm:h-8 sm:w-8 sm:text-[0.85rem]">
            ‹
          </span>
          <span className="truncate">Volver a {category.name}</span>
        </Link>

        <nav className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 font-sans text-[0.65rem] text-warm-gray sm:text-[0.7rem]">
          <Link href="/" className="no-underline hover:text-charcoal transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/#categorías" className="no-underline hover:text-charcoal transition-colors">
            Categorías
          </Link>
          <span>/</span>
          <Link href={`/categoria/${slug}`} className="no-underline hover:text-charcoal transition-colors">{category.name}</Link>
          <span>/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>
      </div>

      <section className="section-editorial pt-5 pb-12 sm:pt-6 sm:pb-16 md:pb-24">
        <div className="grid grid-cols-1 items-start gap-8 sm:gap-10 md:grid-cols-[5.5rem_1fr_1fr] md:gap-6 lg:gap-10">
          <div className="hidden flex-col gap-2.5 md:flex">
            {product.gallery.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                className={`relative aspect-square w-full cursor-pointer overflow-hidden bg-cream-dark transition-all duration-300 ${
                  activeImg === i
                    ? "ring-2 ring-charcoal/50 ring-offset-2 ring-offset-cream"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <CatalogImage
                  src={src}
                  alt={`${product.name} miniatura ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
            <ProductCardImage
              src={product.gallery[activeImg]}
              alt={`${product.name} — vista principal`}
              className="transition-opacity duration-500"
              priority
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            <span className="absolute left-4 top-4 rounded-sm bg-charcoal/80 px-3 py-1.5 font-sans text-[0.6rem] font-medium uppercase tracking-[0.15em] text-cream/95 backdrop-blur-sm">
              {product.woodBadge}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto md:hidden">
            {product.gallery.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                className={`relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden bg-cream-dark transition-all duration-300 ${
                  activeImg === i
                    ? "ring-2 ring-charcoal/50 ring-offset-1 ring-offset-cream"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <CatalogImage
                  src={src}
                  alt={`${product.name} miniatura ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>

          <div className="md:sticky md:top-28">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-label text-warm-gray">{category.name.toUpperCase()}</span>
              <span className="h-[1px] w-6 bg-charcoal/30" />
            </div>

            <h1 className="heading-editorial text-[clamp(1.75rem,6.5vw,2.6rem)] text-charcoal md:text-4xl lg:text-[2.6rem]">
              {product.name}
            </h1>

            {referencePriceText ? (
              <p className="mt-3 font-sans text-[0.72rem] uppercase tracking-[0.14em] text-warm-gray">
                <span className="mr-2 text-charcoal/80">Referencia</span>
                <span
                  key={referencePriceText}
                  className="font-serif text-xl normal-case tracking-normal text-charcoal/80 transition-opacity duration-300 sm:text-2xl md:text-[1.65rem]"
                >
                  {referencePriceText}
                </span>
              </p>
            ) : null}

            <p className="text-body-elegant mt-5 text-[0.85rem] leading-[1.7] text-warm-gray sm:mt-6 sm:text-[0.88rem]">
              {product.description}
            </p>

            {(hasSizes || woodSpecies.length > 0 || finishOptions.length > 0) ? (
            <div className="mt-6 space-y-5 sm:mt-7">
              {hasSizes ? (
                <OptionSelectRow
                  id="product-size-select"
                  label="Medidas"
                  value={selectedSizeId ?? ""}
                  onChange={setSelectedSizeId}
                  options={displaySizes.map((s) => ({ id: s.id, label: s.label }))}
                />
              ) : null}
              <OptionSelectRow
                id="product-wood-select"
                label="Madera"
                value={selectedWoodId ?? ""}
                onChange={setSelectedWoodId}
                options={woodSpecies}
              />
              <OptionSelectRow
                id="product-finish-select"
                label="Acabado"
                value={selectedFinishId ?? ""}
                onChange={setSelectedFinishId}
                options={finishOptions}
              />
            </div>
            ) : null}

            <div className="mt-6">
              <span className="text-label mb-4 block text-warm-gray">Características destacadas</span>
              <ul className="space-y-2.5">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 font-sans text-[0.8rem] text-charcoal/80 sm:text-[0.82rem]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-gold">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2.5 bg-charcoal px-6 py-4 font-sans text-[0.68rem] font-medium uppercase tracking-[0.2em] text-cream no-underline transition-colors duration-300 hover:bg-charcoal-light"
              >
                Consultar por WhatsApp
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex cursor-pointer items-center justify-center gap-2 border border-charcoal/20 bg-transparent px-6 py-4 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-charcoal/70 transition-colors duration-300 hover:border-charcoal hover:text-charcoal"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
                </svg>
                {showShare ? "Enlace copiado" : "Compartir"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {similarProducts.length > 0 && (
        <section className="section-editorial border-t border-sand/30 pb-16 pt-12 sm:pb-20 sm:pt-14 md:pb-28">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-label mb-2 block text-warm-gray">Descubre más</span>
              <h2 className="heading-editorial text-xl text-charcoal sm:text-2xl md:text-3xl">
                Productos Similares
              </h2>
            </div>
            <Link
              href={`/categoria/${slug}`}
              className="hidden items-center gap-1.5 font-serif text-sm italic text-gold no-underline transition-colors hover:text-gold-dark md:inline-flex"
            >
              Ver colección completa →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-7">
            {similarProducts.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href={`/categoria/${slug}/${p.id}`}
                className="group block no-underline"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
                  <ProductCardImage
                    src={p.image}
                    alt={p.name}
                    className="transition-transform duration-[1.4s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <span className="absolute left-2 top-2 rounded-sm bg-charcoal/80 px-2 py-1 font-sans text-[0.55rem] font-medium uppercase tracking-[0.12em] text-cream/95 backdrop-blur-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[0.6rem] sm:tracking-[0.15em]">
                    {p.woodBadge}
                  </span>
                </div>
                <h3 className="heading-editorial mt-3 text-base text-charcoal sm:mt-4 sm:text-lg">{p.name}</h3>
                <p className="mt-1 font-serif text-sm text-charcoal/70 sm:text-base">
                  {getProductListPriceLabel(p.price)}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex justify-center md:hidden">
            <Link
              href={`/categoria/${slug}`}
              className="inline-flex items-center gap-1.5 font-serif text-sm italic text-gold no-underline transition-colors hover:text-gold-dark"
            >
              Ver colección completa →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
