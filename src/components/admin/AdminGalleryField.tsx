"use client";

import { useState } from "react";
import { uploadProductImage } from "@/app/admin/actions/upload";
import { AdminLabel, AdminTextarea } from "@/components/admin/AdminFormControls";
import AdminCatalogImagePicker from "@/components/admin/AdminCatalogImagePicker";

type Props = {
  defaultLines: string[];
};

/**
 * Galería del producto: una URL por línea. Subir archivo, elegir del catálogo o pegar URLs.
 */
export default function AdminGalleryField({ defaultLines }: Props) {
  const [text, setText] = useState(() =>
    defaultLines.filter(Boolean).join("\n")
  );
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  function appendUrl(url: string) {
    setText((prev) => {
      const t = prev.trim();
      return t ? `${t}\n${url}` : url;
    });
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(true);
    setErr("");
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadProductImage(fd);
    setPending(false);
    if (res.ok) appendUrl(res.url);
    else setErr("error" in res ? res.error : "Error al subir.");
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      <AdminLabel>Galería — varias fotos del producto</AdminLabel>
      <AdminTextarea
        name="gallery"
        rows={6}
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="mono"
        textSize="xs"
        placeholder={"/uploads/foto-1.jpg\n/uploads/foto-2.jpg"}
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
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="rounded-sm border border-charcoal/30 bg-white px-3 py-2 font-sans text-[0.65rem] font-medium uppercase tracking-[0.1em] text-charcoal hover:border-charcoal/50 hover:bg-charcoal/[0.04]"
        >
          Añadir imagen subida
        </button>
        {err ? (
          <span className="font-sans text-xs text-red-700">{err}</span>
        ) : null}
      </div>
      <p className="font-sans text-xs leading-relaxed text-warm-gray">
        Cada línea es una foto de la galería. Podés subir archivos nuevos o elegir cualquier
        imagen que ya esté en el sitio.
      </p>

      <AdminCatalogImagePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={appendUrl}
      />
    </div>
  );
}
