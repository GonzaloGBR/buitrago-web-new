"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import LogoMark from "@/components/LogoMark";
import { getMoodboardItems } from "@/lib/moodboard-collage";
import {
  prefersReducedMotion,
  shouldShortenIntroPreload,
} from "@/lib/device-capabilities";
import { r2Asset } from "@/lib/r2-public";

type IntroOverlayProps = {
  onComplete: () => void;
  /** Misma URL que el hero del inicio (y última tarjeta del moodboard). */
  heroImageSrc: string;
  collageImageSrcs: string[];
};

/**
 * Preload con hard-cap de tiempo: si alguna imagen se cuelga (red lenta, 404 silencioso, etc.)
 * resolvemos igualmente al expirar el cap. Evita que el usuario quede mirando "78%" 20 segundos.
 */
function preloadImages(
  urls: string[],
  onProgress: (pct: number) => void,
  hardCapMs: number
): Promise<void> {
  let loaded = 0;
  const total = urls.length;

  return new Promise((resolve) => {
    if (total === 0) {
      onProgress(100);
      resolve();
      return;
    }

    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      onProgress(100);
      resolve();
    };

    const timeoutId = window.setTimeout(finish, hardCapMs);

    urls.forEach((url) => {
      const img = new window.Image();
      const done = () => {
        loaded++;
        if (!resolved) {
          onProgress(Math.round((loaded / total) * 100));
        }
        if (loaded >= total) {
          window.clearTimeout(timeoutId);
          finish();
        }
      };
      img.onload = done;
      img.onerror = done;
      img.src = url;
    });
  });
}

export default function IntroOverlay({
  onComplete,
  heroImageSrc,
  collageImageSrcs,
}: IntroOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [loadDone, setLoadDone] = useState(false);
  const displayPct = useRef(0);

  /**
   * Precarga: hero, logo, 2 primeras tarjetas del moodboard (con hero ya aplicado en la 6.ª).
   * `Set` por si el hero coincide con otra URL.
   */
  const preloadUrls = useMemo(
    () =>
      Array.from(
        new Set<string>([
          heroImageSrc,
          r2Asset("logo.png"),
          ...getMoodboardItems(heroImageSrc, collageImageSrcs).map((m) => m.src),
        ])
      ),
    [heroImageSrc, collageImageSrcs]
  );

  useEffect(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    if (!overlay || !logo) return;

    /**
     * Accesibilidad: si el usuario pidió menos movimiento, saltamos toda la animación con
     * un fade out corto. El sitio sigue operativo y mantiene el "gating" de pintado del
     * resto del home (Hero + moodboard) sin mostrar contador ni collage.
     */
    if (prefersReducedMotion()) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.25,
        ease: "power1.out",
        onComplete,
      });
      return;
    }

    const shortenPreload = shouldShortenIntroPreload();

    /** Mismo ritmo visual en PC, Cursor y móvil; solo acortamos el tope de precarga si hace falta. */
    const counterStep = 1.8;
    const hardCapMs = shortenPreload ? 4000 : 5000;

    gsap.set(logo, { opacity: 0, y: 12 });
    gsap.to(logo, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 });

    let targetPct = 0;

    const ticker = gsap.ticker.add(() => {
      if (displayPct.current < targetPct) {
        displayPct.current = Math.min(displayPct.current + counterStep, targetPct);
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(displayPct.current) + "%";
        }
      }
    });

    preloadImages(preloadUrls, (pct) => {
      targetPct = pct;
    }, hardCapMs).then(() => {
      targetPct = 100;
      const pollMs = 50;
      const waitForDisplay = setInterval(() => {
        if (displayPct.current >= 99) {
          clearInterval(waitForDisplay);
          setLoadDone(true);
        }
      }, pollMs);
    });

    return () => {
      gsap.ticker.remove(ticker);
    };
  }, [onComplete, preloadUrls]);

  useEffect(() => {
    if (!loadDone) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      delay: 0.3,
      onComplete,
    });
  }, [loadDone, onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream"
    >
      <span ref={logoRef} className="block opacity-0">
        <LogoMark
          variant="on-light"
          className="h-[4rem] w-[min(16rem,65vw)] sm:h-[5rem] sm:w-[20rem] md:h-[5.5rem] md:w-[24rem]"
          src={r2Asset("logo.png")}
        />
      </span>

      <span
        ref={counterRef}
        className="mt-5 block font-sans text-[0.72rem] tracking-[0.3em] text-charcoal/40"
      >
        0%
      </span>
    </div>
  );
}
