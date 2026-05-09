"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useFadeUpOnScroll } from "@/lib/use-fade-up-on-scroll";

const marqueeItems = [
  "Muebles artesanales",
  "•",
  "Diseño atemporal",
  "•",
  "Madera noble",
  "•",
  "Hecho a mano",
  "•",
  "Carpintería de lujo",
  "•",
];

export default function MarqueeSection() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;
    gsap.to(marqueeRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 38,
      ease: "none",
    });
  }, []);

  return (
    <section className="overflow-hidden border-b border-sand/35 bg-cream py-12 md:py-16">
      <div
        ref={marqueeRef}
        className="flex items-center gap-8 whitespace-nowrap md:gap-12"
      >
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span
            key={i}
            className={`heading-editorial text-2xl md:text-[2.15rem] ${
              item === "•" ? "text-accent/35" : "text-charcoal/12"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

export function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useFadeUpOnScroll(leftRef, {
    y: 48,
    duration: 1.45,
    start: "top 72%",
    triggerRef: sectionRef,
  });
  useFadeUpOnScroll(rightRef, {
    y: 56,
    duration: 1.45,
    delay: 0.12,
    start: "top 72%",
    triggerRef: sectionRef,
  });

  return (
    <section
      ref={sectionRef}
      id="nosotros"
      className="section-editorial section-y-loose"
    >
      <div className="grid grid-cols-1 items-center gap-10 sm:gap-14 md:grid-cols-2 md:gap-24">
        <div ref={leftRef} className="opacity-0">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/detail-joinery.png"
              alt="Detalle de ensamblaje artesanal Buitrago"
              fill
              className="object-cover transition-transform duration-[2.2s] ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <div ref={rightRef} className="opacity-0">
          <span className="text-label mb-5 block text-warm-gray sm:mb-7">
            Nuestra Filosofía
          </span>

          <h2 className="heading-editorial mb-6 text-[clamp(1.75rem,6vw,3rem)] leading-[1.12] text-charcoal sm:mb-9 md:text-5xl">
            La nobleza de lo hecho
            <span className="text-warm-gray"> a mano</span>
          </h2>

          <p className="text-body-elegant mb-5 max-w-md text-sm text-warm-gray sm:mb-7 sm:text-base">
            En Buitrago, cada pieza nace de una conversación entre la madera y
            las manos que la trabajan. No fabricamos muebles en serie —
            esculpimos legados.
          </p>

          <p className="text-body-elegant mb-9 max-w-md text-sm text-warm-gray sm:mb-12 sm:text-base">
            Tres generaciones de carpinteros nos respaldan. Cada ensamble, cada
            acabado, cada curva cuenta una historia de dedicación y perfección.
          </p>

          <Link href="/conocer-mas" className="btn-editorial no-underline">
            <span>Conocer más</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
