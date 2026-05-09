"use client";

import { useCallback } from "react";
import {
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE_TEL,
} from "@/lib/site-contact";

function buildVCard(): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:Buitrago",
    "ORG:Buitrago — Carpintería artesanal",
    `TEL;TYPE=CELL;TYPE=WHATSAPP:${SITE_CONTACT_PHONE_TEL}`,
    `EMAIL:${SITE_CONTACT_EMAIL}`,
    "NOTE:Historias del taller y muebles en WhatsApp.",
    "END:VCARD",
  ];
  return lines.join("\r\n");
}

export default function SaveContactButton() {
  const download = useCallback(() => {
    const blob = new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "buitrago-contacto.vcf";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <button
      type="button"
      onClick={download}
      className="group inline-flex min-h-[2.75rem] items-center justify-center gap-2.5 rounded-sm border border-cream/30 bg-cream/10 px-6 py-3 font-sans text-[0.68rem] font-medium uppercase tracking-[0.2em] text-cream transition-colors duration-300 hover:border-cream/50 hover:bg-cream/15"
    >
      <span aria-hidden className="text-lg leading-none">
        +
      </span>
      Guardar mi número
    </button>
  );
}
