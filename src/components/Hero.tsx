"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type HeroProps = {
  animateIn: boolean;
  onHeroReady: () => void;
};

export default function Hero({ animateIn, onHeroReady }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroScaleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleBlockRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLDivElement>(null);
  const titleLine2Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mouseLayerRef = useRef<HTMLDivElement>(null);
  const didAnimate = useRef(false);

  useLayoutEffect(() => {
    if (!animateIn || didAnimate.current) return;

    let cancelled = false;
    let rafId = 0;
    let master: gsap.core.Timeline | null = null;
    const scrollTriggers: ScrollTrigger[] = [];
    let moveHandler: ((e: PointerEvent) => void) | null = null;
    let leaveHandler: (() => void) | null = null;
    let sectionForCleanup: HTMLElement | null = null;

    let attempts = 0;
    const MAX_REF_ATTEMPTS = 120;

    const tryRun = () => {
      if (cancelled || didAnimate.current) return;

      const section = sectionRef.current;
      const heroScale = heroScaleRef.current;
      const ov = overlayRef.current;
      const titleBlock = titleBlockRef.current;
      const line1 = titleLine1Ref.current;
      const line2 = titleLine2Ref.current;
      const cta = ctaRef.current;
      const mouseLayer = mouseLayerRef.current;

      if (!section || !heroScale) {
        if (++attempts >= MAX_REF_ATTEMPTS) {
          didAnimate.current = true;
          onHeroReady();
          return;
        }
        rafId = requestAnimationFrame(tryRun);
        return;
      }

      didAnimate.current = true;
      sectionForCleanup = section;

    gsap.set(heroScale, {
      scale: 1.12,
      transformOrigin: "50% 50%",
    });

    if (ov) gsap.set(ov, { opacity: 0 });
    if (titleBlock) gsap.set(titleBlock, { opacity: 0 });
    if (line1) gsap.set(line1.querySelectorAll(".hero-word"), { y: "110%", opacity: 0 });
    if (line2) gsap.set(line2.querySelectorAll(".hero-word"), { y: "110%", opacity: 0 });
    if (cta) gsap.set(cta, { y: 40, opacity: 0 });

    const tl = gsap.timeline();
    master = tl;
    tl.to(
      heroScale,
      { scale: 1, duration: 2, ease: "power2.out" },
      0
    );

    if (ov) {
      tl.to(ov, { opacity: 1, duration: 1.2, ease: "power2.inOut" }, 0.4);
    }

    const textStart = 1.0;

    if (titleBlock) {
      tl.to(titleBlock, { opacity: 1, duration: 0.01 }, textStart);
    }

    if (line1) {
      const words1 = line1.querySelectorAll<HTMLSpanElement>(".hero-word");
      words1.forEach((w, i) => {
        tl.to(w, { y: "0%", opacity: 1, duration: 0.9, ease: "power4.out" }, textStart + 0.05 + i * 0.08);
      });
    }

    if (line2) {
      const words2 = line2.querySelectorAll<HTMLSpanElement>(".hero-word");
      words2.forEach((w, i) => {
        tl.to(w, { y: "0%", opacity: 1, duration: 0.9, ease: "power4.out" }, textStart + 0.2 + i * 0.08);
      });
    }

    if (cta) {
      tl.to(cta, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, textStart + 0.5);
    }

    tl.call(() => { onHeroReady(); }, undefined, textStart + 0.6);

    tl.call(() => {
      const stImage = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1.25,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(heroScale, {
            yPercent: gsap.utils.interpolate(0, 10, p),
            scale: gsap.utils.interpolate(1, 1.045, p),
            transformOrigin: "50% 50%",
          });
        },
      });
      scrollTriggers.push(stImage);

      if (titleBlock) {
        const stTitle = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.85,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(titleBlock, {
              y: gsap.utils.interpolate(0, -88, p),
              opacity: gsap.utils.interpolate(1, 0.06, p),
            });
          },
        });
        scrollTriggers.push(stTitle);
      }

      const fine = window.matchMedia("(pointer: fine)").matches;
      if (fine && mouseLayer) {
        /* Misma suavidad en X e Y; un poco más rápido para que el vertical no “se arrastre”. */
        const quickOpts = { duration: 0.55, ease: "power3.out" as const };
        const xTo = gsap.quickTo(mouseLayer, "x", quickOpts);
        const yTo = gsap.quickTo(mouseLayer, "y", quickOpts);

        const maxPan = 44;

        moveHandler = (e: PointerEvent) => {
          const r = section.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const halfW = r.width / 2 || 1;
          const halfH = r.height / 2 || 1;
          /* Normalizado -1…1 desde el centro del hero */
          const nx = gsap.utils.clamp(-1, 1, (e.clientX - cx) / halfW);
          const ny = gsap.utils.clamp(-1, 1, (e.clientY - cy) / halfH);
          /* Signo opuesto al desplazamiento en px: así la foto “sigue” al cursor (derecha → imagen a la derecha). */
          xTo(-nx * maxPan);
          yTo(-ny * maxPan);
        };
        leaveHandler = () => {
          xTo(0);
          yTo(0);
        };
        section.addEventListener("pointermove", moveHandler);
        section.addEventListener("pointerleave", leaveHandler);
      }

      ScrollTrigger.refresh();
    });
    };

    tryRun();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (master) {
        master.kill();
        scrollTriggers.forEach((t) => t.kill());
        if (sectionForCleanup && moveHandler) {
          sectionForCleanup.removeEventListener("pointermove", moveHandler);
          sectionForCleanup.removeEventListener("pointerleave", leaveHandler!);
        }
      }
      didAnimate.current = false;
    };
  }, [animateIn, onHeroReady]);

  const TITLE_WORDS_1 = ["BUITRAGO"];
  const TITLE_WORDS_2 = ["Muebles", "en", "madera", "maciza."];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative z-0 h-screen min-h-[600px] w-full overflow-hidden bg-[#1a1816] [height:100svh]"
    >
      <div className="absolute inset-0">
        {/*
          Capa más ancha/alta que el viewport: cuando mouseLayer se desplaza con el
          parallax, sigue habiendo foto detrás y no se ve el fondo negro del section.
        */}
        <div
          ref={mouseLayerRef}
          className="absolute inset-0 will-change-transform"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2">
            <div
              ref={heroScaleRef}
              className="relative h-full w-full origin-center scale-[1.12] will-change-transform"
            >
              <Image
                src="/hero-dining-room-hd.png"
                alt="Ambiente con madera noble y diseño de interiores"
                fill
                priority
                quality={90}
                sizes="100vw"
                className="object-cover object-center md:object-[50%_42%]"
              />
            </div>
          </div>
        </div>

        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(22,20,18,0.42)_0%,rgba(22,20,18,0.1)_28%,rgba(22,20,18,0.03)_45%,transparent_58%)]"
          style={{ opacity: 0 }}
        />
      </div>

      <div
        ref={titleBlockRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 pb-[env(safe-area-inset-bottom,0px)] md:px-10"
        style={{ opacity: 0 }}
      >
        <div className="mx-auto max-w-[min(94vw,52rem)] text-center">
          <div ref={titleLine1Ref} className="overflow-hidden">
            <h1 className="heading-display text-[clamp(3.4rem,12.5vw,10rem)] leading-[0.92] tracking-[-0.04em] text-cream">
              {TITLE_WORDS_1.map((word, i) => (
                <span key={i} className="hero-word mr-[0.25em] inline-block" style={{ opacity: 0 }}>
                  {word}
                </span>
              ))}
            </h1>
          </div>
          <div ref={titleLine2Ref} className="overflow-hidden pt-4 md:pt-5">
            <p className="flex flex-wrap items-baseline justify-center gap-x-[0.45em] gap-y-1 text-[clamp(1.05rem,2.75vw,2rem)] font-light leading-[1.45] tracking-[0.06em] text-cream/52 italic [font-family:var(--font-hero)]">
              {TITLE_WORDS_2.map((word, i) => (
                <span key={i} className="hero-word inline-block whitespace-nowrap" style={{ opacity: 0 }}>
                  {word}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div
          ref={ctaRef}
          className="mt-10 md:mt-12"
          style={{ opacity: 0 }}
        >
          <a
            href="#colección"
            className="btn-editorial-light border-cream/35 text-cream no-underline"
          >
            <span>Descubrir</span>
            <span>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
