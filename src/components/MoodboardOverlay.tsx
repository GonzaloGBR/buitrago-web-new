"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  isLowEndDevice,
  isMobileViewport,
  prefersReducedMotion,
} from "@/lib/device-capabilities";
import { r2Asset } from "@/lib/r2-public";
import { shouldUnoptimizeImage } from "@/lib/image-url";

export interface MoodboardItem {
  src: string;
  alt: string;
  finalX: string;
  finalY: string;
  width: string;
  height: string;
  rotation: number;
  zIndex: number;
}

/**
 * Timings del collage. Hay dos juegos:
 *  - DESKTOP: sensación "editorial" más pausada.
 *  - MOBILE / low-end: ~35% más rápido en stagger y 30% más corto en duración para que no se
 *    perciba lento en dispositivos con GPU modesta. El slide up también se acorta.
 *
 * La ventana total antes de ver el hero:
 *   t_hero ≈ (N-1) * STAGGER + DURATION + SLIDE_UP
 *   Desktop: 5*0.38 + 1.12 + 1.0  ≈ 4.0 s
 *   Mobile : 5*0.24 + 0.80 + 0.75 ≈ 2.75 s
 */
const CARD_STAGGER_DESKTOP = 0.38;
const CARD_DURATION_DESKTOP = 1.12;
const SLIDE_UP_DURATION_DESKTOP = 1;

const CARD_STAGGER_MOBILE = 0.24;
const CARD_DURATION_MOBILE = 0.8;
const SLIDE_UP_DURATION_MOBILE = 0.75;

/**
 * Imágenes que componen el collage del moodboard. `IntroOverlay` las precarga (junto al hero
 * y el logo) para que la transición al moodboard sea instantánea.
 */
export const MOODBOARD_ITEMS: MoodboardItem[] = [
  {
    src: r2Asset("gabinetes/1-gabinetes.jpg"),
    alt: "Gabinete artesanal",
    finalX: "8%", finalY: "12%", width: "clamp(140px, 20vw, 280px)", height: "clamp(180px, 26vw, 360px)",
    rotation: -3, zIndex: 1,
  },
  {
    src: r2Asset("sillas/1-sillas.jpg"),
    alt: "Silla de diseño",
    finalX: "28%", finalY: "16%", width: "clamp(160px, 24vw, 340px)", height: "clamp(200px, 28vw, 400px)",
    rotation: -1, zIndex: 2,
  },
  {
    src: r2Asset("gabinetes/2-gabinetes.jpg"),
    alt: "Detalle de carpintería",
    finalX: "52%", finalY: "6%", width: "clamp(140px, 19vw, 270px)", height: "clamp(120px, 16vw, 220px)",
    rotation: 2.5, zIndex: 3,
  },
  {
    src: r2Asset("mesas-de-centro/3-mesa-de-centro.jpg"),
    alt: "Mesa ratona",
    finalX: "54%", finalY: "24%", width: "clamp(150px, 22vw, 310px)", height: "clamp(180px, 24vw, 340px)",
    rotation: 3, zIndex: 4,
  },
  {
    src: r2Asset("mesas-de-comedor/1-mesa-de-comedor.jpg"),
    alt: "Mesa de comedor",
    finalX: "22%", finalY: "44%", width: "clamp(160px, 24vw, 340px)", height: "clamp(140px, 18vw, 260px)",
    rotation: -2, zIndex: 5,
  },
  {
    src: r2Asset("fondo-hero.jpg"),
    alt: "Interior con muebles Buitrago",
    finalX: "42%", finalY: "40%", width: "clamp(170px, 24vw, 340px)", height: "clamp(140px, 18vw, 260px)",
    rotation: 1.5, zIndex: 6,
  },
];

const HERO_CARD_INDEX = MOODBOARD_ITEMS.length - 1;

/** Última tarjeta del collage usa la misma foto que el hero (configurable desde el admin). */
export function getMoodboardItems(heroImageSrc: string): MoodboardItem[] {
  const items = MOODBOARD_ITEMS.map((item) => ({ ...item }));
  items[HERO_CARD_INDEX] = {
    ...items[HERO_CARD_INDEX],
    src: heroImageSrc,
  };
  return items;
}

type Props = {
  startAnimation: boolean;
  heroImageSrc: string;
  /** Se llama en el primer frame del deslizamiento hacia arriba (el hero ya se ve debajo). */
  onRevealStart?: () => void;
  onComplete: () => void;
};

export default function MoodboardOverlay({
  startAnimation,
  heroImageSrc,
  onRevealStart,
  onComplete,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const didStart = useRef(false);

  useEffect(() => {
    if (!startAnimation || didStart.current) return;
    didStart.current = true;

    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;

    /**
     * Accesibilidad / rendimiento: si el usuario pidió "reduce motion", saltamos todo el
     * collage y hacemos solo un fade a transparent. Notificamos `onRevealStart` y `onComplete`
     * igual que en la ruta normal para que `home-client` marque el hero como revelado.
     */
    if (prefersReducedMotion()) {
      onRevealStart?.();
      gsap.to(root, {
        opacity: 0,
        duration: 0.35,
        ease: "power1.out",
        onComplete,
      });
      return;
    }

    const mobile = isMobileViewport() || isLowEndDevice();
    const stagger = mobile ? CARD_STAGGER_MOBILE : CARD_STAGGER_DESKTOP;
    const cardDuration = mobile ? CARD_DURATION_MOBILE : CARD_DURATION_DESKTOP;
    const slideDuration = mobile ? SLIDE_UP_DURATION_MOBILE : SLIDE_UP_DURATION_DESKTOP;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const items = getMoodboardItems(heroImageSrc);

    cards.forEach((card) => {
      gsap.set(card, {
        scale: 0.15, opacity: 0,
        x: 0, y: 0, rotation: 0,
        xPercent: -50, yPercent: -50,
        left: "50%", top: "50%",
      });
    });

    if (counterRef.current) gsap.set(counterRef.current, { opacity: 0 });

    const tl = gsap.timeline();

    if (counterRef.current) {
      tl.to(counterRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0);
    }

    cards.forEach((card, i) => {
      const item = items[i];
      const start = i * stagger;

      tl.to(card, {
        scale: 1, opacity: 1,
        left: item.finalX, top: item.finalY,
        xPercent: 0, yPercent: 0,
        rotation: item.rotation,
        duration: cardDuration, ease: "power2.out",
      }, start);

      if (counterRef.current) {
        tl.set(counterRef.current, { innerText: String(i + 1) }, start);
      }
    });

    tl.to(counterRef.current, { opacity: 0, duration: 0.28, ease: "power2.inOut" }, "-=0.28");

    tl.to(root, {
      yPercent: -100,
      duration: slideDuration,
      ease: "power3.inOut",
      onStart: () => {
        onRevealStart?.();
      },
      onComplete,
    }, "+=0");

    return () => { tl.kill(); };
  }, [startAnimation, onComplete, onRevealStart, heroImageSrc]);

  const items = getMoodboardItems(heroImageSrc);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[95] bg-cream"
      style={{ willChange: "transform" }}
    >
      <div
        ref={innerRef}
        className="relative mx-auto flex h-full w-full max-w-[900px] items-center justify-center"
      >
        {items.map((item, i) => (
          <div
            key={`${i}-${item.src}`}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="absolute overflow-hidden rounded-md shadow-lg"
            style={{
              width: item.width, height: item.height,
              zIndex: item.zIndex, opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            <Image
              src={item.src} alt={item.alt} fill
              className="object-cover"
              unoptimized={shouldUnoptimizeImage(item.src)}
              /* En móvil las tarjetas ocupan como mucho ~24vw por los clamps de `width`. Un
                 `sizes` ajustado hace que next/image entregue versiones más pequeñas (menos
                 bytes, decodificación más rápida), que es exactamente lo que esta animación
                 necesita para no sentirse lenta. */
              sizes="(max-width: 768px) 28vw, 22vw"
              priority={i < 2}
              loading={i < 2 ? "eager" : "lazy"}
              quality={70}
            />
          </div>
        ))}

        <span
          ref={counterRef}
          className="absolute right-[8%] top-1/2 -translate-y-1/2 font-sans text-[0.8rem] tabular-nums tracking-[0.2em] text-charcoal/30 opacity-0"
        >
          1
        </span>
      </div>
    </div>
  );
}
