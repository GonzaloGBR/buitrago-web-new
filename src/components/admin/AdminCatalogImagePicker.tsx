"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { fetchAllSiteImagesAction } from "@/app/admin/actions/catalog-images";
import type { CatalogImageOption } from "@/lib/catalog-images";
import { shouldUnoptimizeImage } from "@/lib/image-url";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
};

export default function AdminCatalogImagePicker({
  open,
  onClose,
  onSelect,
}: Props) {
  const [images, setImages] = useState<CatalogImageOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    const res = await fetchAllSiteImagesAction();
    setLoading(false);
    if (!res.ok) {
      setErr(res.error);
      setImages([]);
      return;
    }
    setImages(res.data.images);
    if (res.data.images.length === 0) {
      setErr("Aún no hay imágenes en el sitio. Subí fotos en Productos o Categorías.");
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    void load();
  }, [open, load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return images;
    return images.filter(
      (img) =>
        img.caption.toLowerCase().includes(q) ||
        img.url.toLowerCase().includes(q)
    );
  }, [images, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-charcoal/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalog-picker-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(92vh,720px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-lg border border-charcoal/15 bg-cream shadow-xl sm:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-charcoal/10 px-4 py-4 sm:px-5">
          <div>
            <h2
              id="catalog-picker-title"
              className="font-serif text-lg text-charcoal sm:text-xl"
            >
              Elegir imagen del sitio
            </h2>
            <p className="mt-1 font-sans text-xs text-warm-gray">
              Todas las fotos subidas (categorías, productos e imágenes del sitio).{" "}
              {!loading && images.length > 0 ? (
                <span className="text-charcoal/70">{images.length} en total</span>
              ) : null}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-sm px-2 py-1 font-sans text-sm text-charcoal/70 hover:bg-charcoal/5 hover:text-charcoal"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-charcoal/10 px-4 py-3 sm:px-5">
          <label className="sr-only" htmlFor="catalog-picker-search">
            Buscar imagen
          </label>
          <input
            id="catalog-picker-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o URL…"
            className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2 font-sans text-sm text-charcoal outline-none placeholder:text-warm-gray focus:border-charcoal/40"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {loading ? (
            <p className="py-8 text-center font-sans text-sm text-warm-gray">
              Cargando imágenes…
            </p>
          ) : err && filtered.length === 0 ? (
            <p className="py-8 text-center font-sans text-sm text-warm-gray">{err}</p>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center font-sans text-sm text-warm-gray">
              Ninguna imagen coincide con la búsqueda.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((img) => (
                <li key={img.url}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(img.url);
                      onClose();
                    }}
                    className="group w-full overflow-hidden rounded-md border border-charcoal/10 bg-white text-left transition hover:border-charcoal/35 hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] w-full bg-charcoal/5">
                      <Image
                        src={img.url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="200px"
                        unoptimized={shouldUnoptimizeImage(img.url)}
                      />
                    </div>
                    <p className="line-clamp-2 px-2 py-2 font-sans text-[0.65rem] leading-snug text-charcoal group-hover:text-charcoal">
                      {img.caption}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
