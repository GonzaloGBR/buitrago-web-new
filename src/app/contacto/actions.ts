"use server";

import { headers } from "next/headers";
import { SITE_CONTACT_EMAIL } from "@/lib/site-contact";
import { prisma } from "@/lib/prisma";
import {
  contactRateLimitKey,
  isContactRateLimited,
  recordContactSubmission,
} from "@/lib/rate-limit-contact";

export type ContactFormState = {
  ok?: boolean;
  error?: string;
  /** Enlace mailto para abrir el cliente de correo del visitante. */
  mailto?: string;
};

const MAX_MSG = 4000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function clientIp(): Promise<string> {
  const h = await headers();
  const xf = h.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip")?.trim() || "unknown";
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2 || name.length > 120) {
    return { error: "Indica tu nombre (entre 2 y 120 caracteres)." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Introduce un correo electrónico válido." };
  }
  if (phone.length > 40) {
    return { error: "El teléfono es demasiado largo." };
  }
  if (message.length < 10) {
    return { error: "Escribe un mensaje de al menos 10 caracteres." };
  }
  if (message.length > MAX_MSG) {
    return { error: `El mensaje no puede superar ${MAX_MSG} caracteres.` };
  }

  const ipHash = contactRateLimitKey(await clientIp());
  if (isContactRateLimited(ipHash)) {
    return {
      error: "Demasiados envíos desde esta conexión. Probá de nuevo más tarde.",
    };
  }

  try {
    await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        ipHash,
      },
    });
    recordContactSubmission(ipHash);
  } catch (e) {
    console.error(e);
    return { error: "No pudimos guardar tu mensaje. Probá de nuevo." };
  }

  const subject = encodeURIComponent(`Contacto web — ${name}`);
  const body = encodeURIComponent(
    `Nombre: ${name}\nCorreo: ${email}\nTeléfono: ${phone || "—"}\n\nMensaje:\n${message}`
  );
  const mailto = `mailto:${SITE_CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  if (mailto.length > 8000) {
    return { error: "El mensaje es demasiado largo; acórtalo un poco." };
  }

  return { ok: true, mailto };
}
