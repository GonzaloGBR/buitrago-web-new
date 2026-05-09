"use client";

import { useState } from "react";
import { uploadProductImage } from "@/app/admin/actions/upload";
import { AdminInput, AdminLabel } from "@/components/admin/AdminFormControls";

type Props = {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
};

export default function AdminImageField({
  name,
  label,
  defaultValue = "",
  required,
}: Props) {
  const [url, setUrl] = useState(defaultValue);
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
    if (res.ok) setUrl(res.url);
    else setErr("error" in res ? res.error : "Error al subir.");
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      <AdminLabel>{label}</AdminLabel>
      <input type="hidden" name={name} value={url} />
      <AdminInput
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required={required}
        placeholder="/collection-table.png o /uploads/…"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-sm border border-charcoal/20 bg-cream px-3 py-2 font-sans text-[0.65rem] uppercase tracking-[0.12em] text-charcoal hover:bg-cream-dark">
          {pending ? "Subiendo…" : "Subir archivo"}
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
    </div>
  );
}
