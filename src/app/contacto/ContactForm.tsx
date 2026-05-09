"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactForm, type ContactFormState } from "./actions";
import { SITE_CONTACT_EMAIL } from "@/lib/site-contact";

const initial: ContactFormState = {};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initial);
  const openedRef = useRef(false);

  useEffect(() => {
    if (state.error) openedRef.current = false;
  }, [state.error]);

  useEffect(() => {
    if (!state.ok || !state.mailto || openedRef.current) return;
    openedRef.current = true;
    window.location.href = state.mailto;
  }, [state.ok, state.mailto]);

  return (
    <form action={formAction} className="mx-auto max-w-xl space-y-8">
      {state.error ? (
        <p
          role="alert"
          className="rounded-sm border border-red-200/80 bg-red-50/90 px-4 py-3 font-sans text-sm text-red-950"
        >
          {state.error}
        </p>
      ) : null}

      {state.ok ? (
        <p className="rounded-sm border border-sand/40 bg-cream-dark/50 px-4 py-3 font-sans text-sm text-charcoal/90">
          Si no se abrió tu aplicación de correo,{" "}
          <a href={state.mailto} className="text-charcoal underline underline-offset-2">
            pulsa aquí
          </a>{" "}
          para enviar el mensaje a {SITE_CONTACT_EMAIL}.
        </p>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="name" className="text-label text-charcoal/80">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          disabled={pending}
          className="w-full border border-charcoal/15 bg-cream px-4 py-3 font-sans text-base text-charcoal outline-none transition-[border-color,box-shadow] focus:border-charcoal/35 focus:ring-1 focus:ring-charcoal/20 sm:text-sm"
          placeholder="Tu nombre"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-label text-charcoal/80">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={pending}
          className="w-full border border-charcoal/15 bg-cream px-4 py-3 font-sans text-base text-charcoal outline-none transition-[border-color,box-shadow] focus:border-charcoal/35 focus:ring-1 focus:ring-charcoal/20 sm:text-sm"
          placeholder="tu@correo.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-label text-charcoal/80">
          Teléfono <span className="font-sans font-normal text-warm-gray">(opcional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          disabled={pending}
          className="w-full border border-charcoal/15 bg-cream px-4 py-3 font-sans text-base text-charcoal outline-none transition-[border-color,box-shadow] focus:border-charcoal/35 focus:ring-1 focus:ring-charcoal/20 sm:text-sm"
          placeholder="+54 11 …"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-label text-charcoal/80">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          disabled={pending}
          className="w-full resize-y border border-charcoal/15 bg-cream px-4 py-3 font-sans text-base text-charcoal outline-none transition-[border-color,box-shadow] focus:border-charcoal/35 focus:ring-1 focus:ring-charcoal/20 sm:text-sm"
          placeholder="Cuéntanos sobre tu proyecto, plazos o cualquier detalle que consideres útil."
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="btn-editorial inline-flex min-h-[3rem] items-center justify-center gap-2 border-0 px-8 disabled:opacity-60"
        >
          <span>{pending ? "Preparando…" : "Enviar mensaje"}</span>
          {!pending ? <span aria-hidden>→</span> : null}
        </button>
      </div>

      <p className="font-sans text-xs leading-relaxed text-warm-gray">
        Al enviar se abrirá tu programa de correo con el mensaje listo para enviar a{" "}
        <span className="text-charcoal/80">{SITE_CONTACT_EMAIL}</span>. Solo tienes que confirmar el
        envío en esa ventana.
      </p>
    </form>
  );
}
