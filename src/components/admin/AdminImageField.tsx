"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadProductImage } from "@/app/admin/actions/upload";
import { AdminInput, AdminLabel } from "@/components/admin/AdminFormControls";
import AdminCatalogImagePicker from "@/components/admin/AdminCatalogImagePicker";
import { shouldUnoptimizeImage } from "@/lib/image-url";

type Props = {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  /** Mostrar botón para elegir entre todas las imágenes ya subidas al sitio. */
  enableCatalogPicker?: boolean;
};

export default function AdminImageField({
  name,
  label,
  defaultValue = "",
  required,
  enableCatalogPicker = true,
}: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(true);
    setErr("");
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadProductImage(fd);
    setPending(false);
    if (res.ok) setUrl(res.url);
    else setErr("error" in res ? res.error : "Error al subir.");
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      <AdminLabel>{label}</AdminLabel>
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="relative h-28 w-full max-w-xs overflow-hidden rounded-md border border-charcoal/10 bg-charcoal/5">
          <Image
            src={url}
            alt="Vista previa"
            fill
            className="object-cover"
            sizes="320px"
            unoptimized={shouldUnoptimizeImage(url)}
          />
        </div>
      ) : null}
      <AdminInput
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required={required}
        placeholder="/uploads/… o URL de R2"
      />
      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-sm border border-charcoal/20 bg-cream px-3 py-2 font-sans text-[0.65rem] font-medium uppercase tracking-[0.1em] text-charcoal hover:bg-cream-dark">
          {pending ? "Subiendo…" : "Subir archivo nuevo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="sr-only"
            disabled={pending}
            onChange={onFile}
          />
        </label>
        {enableCatalogPicker ? (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="rounded-sm border border-charcoal/30 bg-white px-3 py-2 font-sans text-[0.65rem] font-medium uppercase tracking-[0.1em] text-charcoal hover:border-charcoal/50 hover:bg-charcoal/[0.04]"
          >
            Elegir imagen subida
          </button>
        ) : null}
        {err ? (
          <span className="font-sans text-xs text-red-700">{err}</span>
        ) : null}
      </div>

      {enableCatalogPicker ? (
        <AdminCatalogImagePicker
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={setUrl}
        />
      ) : null}
    </div>
  );
}
