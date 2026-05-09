"use client";

import { useState } from "react";
import { uploadProductImage } from "@/app/admin/actions/upload";
import { AdminLabel, AdminTextarea } from "@/components/admin/AdminFormControls";

type Props = {
  /** URLs iniciales (modo edición). */
  defaultLines: string[];
};

/**
 * Galería del producto: una URL por línea. Permite subir varias imágenes;
 * cada subida añade una línea al final del texto.
 */
export default function AdminGalleryField({ defaultLines }: Props) {
  const [text, setText] = useState(() =>
    defaultLines.filter(Boolean).join("\n")
  );
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(true);
    setErr("");
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadProductImage(fd);
    setPending(false);
    if (res.ok) {
      setText((prev) => {
        const t = prev.trim();
        return t ? `${t}\n${res.url}` : res.url;
      });
    } else setErr("error" in res ? res.error : "Error al subir.");
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
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-sm border border-charcoal/20 bg-cream px-3 py-2 font-sans text-[0.65rem] uppercase tracking-[0.12em] text-charcoal hover:bg-cream-dark">
          {pending ? "Subiendo…" : "Añadir imagen a la galería"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={pending}
            onChange={onFile}
          />
        </label>
        {err ? (
          <span className="font-sans text-xs text-red-700">{err}</span>
        ) : null}
      </div>
      <p className="font-sans text-xs leading-relaxed text-warm-gray">
        <strong className="font-medium text-charcoal/70">Cómo funciona:</strong>{" "}
        cada línea es la ruta de una foto (la que verá el cliente al pasar de
        miniatura en miniatura). Puedes usar{" "}
        <span className="whitespace-nowrap">«Añadir imagen»</span> varias
        veces: cada archivo subido se agrega al final. También puedes escribir
        o pegar URLs manualmente, una por línea. Lo habitual es repetir la
        imagen principal en la primera línea y luego el resto de ángulos.
      </p>
    </div>
  );
}
