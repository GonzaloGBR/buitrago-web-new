"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  isLowEndDevice,
  isMobileViewport,
  prefersReducedMotion,
} from "@/lib/device-capabilities";
import { getMoodboardItems, type MoodboardItem } from "@/lib/moodboard-collage";
import { shouldUnoptimizeImage } from "@/lib/image-url";

export type { MoodboardItem };
export { getMoodboardItems } from "@/lib/moodboard-collage";

const CARD_STAGGER_DESKTOP = 0.38;
const CARD_DURATION_DESKTOP = 1.12;
const SLIDE_UP_DURATION_DESKTOP = 1;

const CARD_STAGGER_MOBILE = 0.24;
const CARD_DURATION_MOBILE = 0.8;
const SLIDE_UP_DURATION_MOBILE = 0.75;

type Props = {
  startAnimation: boolean;
  heroImageSrc: string;
  collageImageSrcs: string[];
  onRevealStart?: () => void;
  onComplete: () => void;
};

export default function MoodboardOverlay({
  startAnimation,
  heroImageSrc,
  collageImageSrcs,
  onRevealStart,
  onComplete,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const didStart = useRef(false);
  const finished = useRef(false);

  const onRevealStartRef = useRef(onRevealStart);
  const onCompleteRef = useRef(onComplete);
  onRevealStartRef.current = onRevealStart;
  onCompleteRef.current = onComplete;

  const collageKey = collageImageSrcs.join("\0");

  const items = useMemo(
    () => getMoodboardItems(heroImageSrc, collageImageSrcs),
    [heroImageSrc, collageKey]
  );

  useEffect(() => {
    if (!startAnimation || didStart.current) return;

    const root = rootRef.current;
    if (!root) return;

    didStart.current = true;

    const complete = () => {
      if (finished.current) return;
      finished.current = true;
      onCompleteRef.current();
    };

    if (prefersReducedMotion()) {
      onRevealStartRef.current?.();
      gsap.to(root, {
        opacity: 0,
        duration: 0.35,
        ease: "power1.out",
        onComplete: complete,
      });
      return;
    }

    const mobile = isMobileViewport() || isLowEndDevice();
    const stagger = mobile ? CARD_STAGGER_MOBILE : CARD_STAGGER_DESKTOP;
    const cardDuration = mobile ? CARD_DURATION_MOBILE : CARD_DURATION_DESKTOP;
    const slideDuration = mobile ? SLIDE_UP_DURATION_MOBILE : SLIDE_UP_DURATION_DESKTOP;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const layoutItems = getMoodboardItems(heroImageSrc, collageImageSrcs);

    cards.forEach((card) => {
      gsap.set(card, {
        scale: 0.15,
        opacity: 0,
        x: 0,
        y: 0,
        rotation: 0,
        xPercent: -50,
        yPercent: -50,
        left: "50%",
        top: "50%",
      });
    });

    const counter = counterRef.current;
    if (counter) gsap.set(counter, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: complete,
    });

    if (counter) {
      tl.to(counter, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0);
    }

    cards.forEach((card, i) => {
      const item = layoutItems[i];
      if (!item) return;
      const start = i * stagger;

      tl.to(
        card,
        {
          scale: 1,
          opacity: 1,
          left: item.finalX,
          top: item.finalY,
          xPercent: 0,
          yPercent: 0,
          rotation: item.rotation,
          duration: cardDuration,
          ease: "power2.out",
        },
        start
      );

      if (counter) {
        tl.set(counter, { innerText: String(i + 1) }, start);
      }
    });

    if (counter) {
      tl.to(counter, { opacity: 0, duration: 0.28, ease: "power2.inOut" }, "-=0.28");
    }

    tl.to(
      root,
      {
        yPercent: -100,
        duration: slideDuration,
        ease: "power3.inOut",
        onStart: () => {
          onRevealStartRef.current?.();
        },
      },
      "+=0"
    );

    return () => {
      if (!finished.current) {
        tl.kill();
      }
    };
  }, [startAnimation, heroImageSrc, collageKey]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[95] bg-cream"
      style={{ willChange: "transform" }}
    >
      <div className="relative mx-auto flex h-full w-full max-w-[900px] items-center justify-center">
        {items.map((item, i) => (
          <div
            key={`${i}-${item.src}`}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className="absolute overflow-hidden rounded-md shadow-lg"
            style={{
              width: item.width,
              height: item.height,
              zIndex: item.zIndex,
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover"
              unoptimized={shouldUnoptimizeImage(item.src)}
              sizes="(max-width: 768px) 28vw, 22vw"
              priority
              loading="eager"
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
