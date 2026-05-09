"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE_DISPLAY,
  SITE_CONTACT_PHONE_TEL,
} from "@/lib/site-contact";
import { useFadeUpOnScroll } from "@/lib/use-fade-up-on-scroll";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useFadeUpOnScroll(titleRef, {
    y: 56,
    duration: 1.4,
    start: "top 72%",
    triggerRef: sectionRef,
  });
  useFadeUpOnScroll(contentRef, {
    y: 32,
    duration: 1.15,
    delay: 0.18,
    start: "top 72%",
    triggerRef: sectionRef,
  });

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className="relative overflow-hidden bg-charcoal py-20 text-cream sm:py-28 md:py-52"
    >
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(247,245,240,0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="section-editorial relative text-center">
        <span className="text-label text-warm-gray block mb-6 sm:mb-8">
          Hablemos de tu proyecto
        </span>

        <h2
          ref={titleRef}
          className="heading-display text-[clamp(2.25rem,7vw,7rem)] text-cream mb-6 opacity-0 sm:mb-8"
        >
          Creemos algo
          <br />
          <span className="text-accent">extraordinario</span>
        </h2>

        <div ref={contentRef} className="opacity-0">
          <p className="text-body-elegant text-warm-gray-light max-w-lg mx-auto mb-10 px-2 text-sm sm:mb-12 sm:px-0 sm:text-base">
            Cada proyecto comienza con una idea. Cuéntanos la tuya y juntos la
            transformaremos en una pieza que perdure por generaciones.
          </p>

          <Link href="/contacto" className="btn-editorial-light no-underline">
            <span>Formulario de contacto</span>
            <span>→</span>
          </Link>

          {/* Contact Details */}
          <div className="mt-14 pt-10 border-t border-warm-gray/20 grid grid-cols-1 gap-8 text-center sm:mt-20 sm:pt-12 md:grid-cols-3 md:text-left">
            <div>
              <p className="text-label text-warm-gray mb-3">Visítanos</p>
              <p className="text-body-elegant text-cream/80 text-sm">
                Salta, Argentina
              </p>
            </div>
            <div>
              <p className="text-label text-warm-gray mb-3">Escríbenos</p>
              <a
                href={`mailto:${SITE_CONTACT_EMAIL}`}
                className="text-body-elegant break-all text-sm text-cream/80 transition-colors duration-500 hover:text-accent"
              >
                {SITE_CONTACT_EMAIL}
              </a>
              <a
                href={`tel:${SITE_CONTACT_PHONE_TEL}`}
                className="mt-2 block text-body-elegant text-sm text-cream/80 transition-colors duration-500 hover:text-accent"
              >
                {SITE_CONTACT_PHONE_DISPLAY}
              </a>
            </div>
            <div>
              <p className="text-label text-warm-gray mb-3">Síguenos</p>
              <div className="flex justify-center gap-6 md:justify-start">
                {["Instagram", "Pinterest"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-label text-cream/80 transition-colors duration-500 hover:text-accent"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
