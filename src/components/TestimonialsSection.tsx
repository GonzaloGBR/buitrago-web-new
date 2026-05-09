"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "El escritorio que Buitrago creó para mi estudio no es solo un mueble, es la pieza central que define todo el espacio. La calidad es incomparable.",
    author: "Martín Rosas",
    role: "Arquitecto",
  },
  {
    quote:
      "Trabajar con ellos fue una experiencia. Escucharon cada detalle y lo tradujeron en una mesa de comedor que lleva tres años siendo el corazón de nuestro hogar.",
    author: "Carolina Vega",
    role: "Diseñadora de Interiores",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.25,
            delay: i * 0.14,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial section-y-loose">
      <div className="mb-12 sm:mb-16 md:mb-28">
        <span className="text-label mb-4 block text-warm-gray sm:mb-5">
          Testimonios
        </span>
        <h2 className="heading-editorial text-[clamp(1.875rem,6.5vw,3rem)] text-charcoal md:text-5xl">
          Lo que dicen
          <br />
          <span className="text-warm-gray">nuestros clientes</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-20">
        {testimonials.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) cardsRef.current[i] = el;
            }}
            className="border-t border-sand pt-6 opacity-0 sm:pt-8"
          >
            <span className="heading-editorial mb-5 block text-5xl text-accent/25 sm:mb-7 sm:text-6xl md:text-8xl">
              &ldquo;
            </span>
            <p className="heading-editorial mb-6 text-lg leading-snug text-charcoal sm:mb-8 sm:text-xl md:text-2xl">
              {item.quote}
            </p>
            <div>
              <p className="text-label text-charcoal">{item.author}</p>
              <p className="text-label text-warm-gray mt-1">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
