"use client";

import { useState, useCallback, useEffect, useLayoutEffect } from "react";
import {
  markHomeEntranceConsumed,
  shouldPlayFullHomeEntrance,
} from "@/lib/home-entrance";
import { getLenisInstance } from "@/lib/lenis-bridge";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IntroOverlay from "@/components/IntroOverlay";
import MoodboardOverlay from "@/components/MoodboardOverlay";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeSection, { PhilosophySection } from "@/components/Sections";
import FeaturedProducts from "@/components/CollectionGrid";
import CategoriesSection from "@/components/CategoriesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import type { Category, FeaturedHomeItem } from "@/data/catalog";

type Props = {
  categories: Category[];
  featured: FeaturedHomeItem[];
};

export default function HomeClient({ categories, featured }: Props) {
  /**
   * SSR y el PRIMER render del cliente deben producir el mismo HTML — de lo contrario React
   * lanza un "hydration mismatch". Por eso los flags arrancan en `true` (= sitio completo,
   * sin intro) en ambos entornos: es un árbol válido para SSR y para la mayoría de
   * navegaciones (SPA, router.back, etc.).
   *
   * Un `useLayoutEffect` (que NO corre en server) revisa después si toca jugar la intro
   * — solo ocurre en un reload "real" del documento estando en "/". En ese caso baja los
   * flags a `false` ANTES del primer paint, con lo que el usuario ve directamente el
   * IntroOverlay sin flash del sitio.
   */
  const [preloaderDone, setPreloaderDone] = useState(true);
  const [moodboardDone, setMoodboardDone] = useState(true);
  const [heroRevealStarted, setHeroRevealStarted] = useState(true);
  const [siteChromeVisible, setSiteChromeVisible] = useState(true);

  useLayoutEffect(() => {
    if (shouldPlayFullHomeEntrance()) {
      // Sincronización con un sistema externo (PerformanceNavigationTiming): no se puede
      // calcular en el initializer sin romper SSR. Los set-state corren en useLayoutEffect
      // antes del paint → no hay flash del contenido.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreloaderDone(false);
      setMoodboardDone(false);
      setHeroRevealStarted(false);
      setSiteChromeVisible(false);
    }
    markHomeEntranceConsumed();
  }, []);

  const handleIntroEnd = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  const handleMoodboardEnd = useCallback(() => {
    setMoodboardDone(true);
  }, []);

  const handleMoodboardRevealStart = useCallback(() => {
    setHeroRevealStarted(true);
  }, []);

  const handleHeroReady = useCallback(() => {
    setSiteChromeVisible(true);
  }, []);

  /* Si el timeline del Hero falla o se interrumpe antes de `onHeroReady`, no dejar el sitio sin nav ni scroll. */
  useEffect(() => {
    if (siteChromeVisible || !heroRevealStarted) return;
    const id = window.setTimeout(() => {
      setSiteChromeVisible(true);
    }, 5000);
    return () => window.clearTimeout(id);
  }, [heroRevealStarted, siteChromeVisible]);

  useEffect(() => {
    if (!siteChromeVisible) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      const hash = window.location.hash;
      if (!hash || hash === "#") {
        window.scrollTo(0, 0);
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [siteChromeVisible]);

  useEffect(() => {
    if (!siteChromeVisible) return;
    const hash = window.location.hash;
    if (!hash || hash === "#") return;
    const id = decodeURIComponent(hash.slice(1));
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        const lenis = getLenisInstance();
        if (el && lenis) {
          lenis.resize();
          lenis.scrollTo(el, { offset: -72, immediate: true, force: true });
        } else if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top, behavior: "auto" });
        }
        ScrollTrigger.refresh();
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [siteChromeVisible]);

  useEffect(() => {
    if (!siteChromeVisible) {
      const lock = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const resetPos = () => window.scrollTo(0, 0);

      window.addEventListener("wheel", lock, { passive: false, capture: true });
      window.addEventListener("touchmove", lock, { passive: false, capture: true });
      window.addEventListener("scroll", resetPos, { passive: true });

      return () => {
        window.removeEventListener("wheel", lock, true);
        window.removeEventListener("touchmove", lock, true);
        window.removeEventListener("scroll", resetPos);
      };
    }
  }, [siteChromeVisible]);

  useEffect(() => {
    if (!siteChromeVisible) return;
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [siteChromeVisible]);

  return (
    <>
      {!preloaderDone && <IntroOverlay onComplete={handleIntroEnd} />}

      {!moodboardDone && (
        <MoodboardOverlay
          startAnimation={preloaderDone}
          onRevealStart={handleMoodboardRevealStart}
          onComplete={handleMoodboardEnd}
        />
      )}

      <Navbar siteChromeVisible={siteChromeVisible} />

      <main>
        <Hero animateIn={heroRevealStarted} onHeroReady={handleHeroReady} />

        {siteChromeVisible && (
          <>
            <MarqueeSection />
            <PhilosophySection />
            <FeaturedProducts items={featured} />
            <CategoriesSection categories={categories} />
            <TestimonialsSection />
            <ContactSection />
          </>
        )}
      </main>

      {siteChromeVisible && <Footer />}
    </>
  );
}
