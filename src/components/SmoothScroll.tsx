"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenisInstance } from "@/lib/lenis-bridge";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const lenis = lenisRef.current;
    const hasHash =
      typeof window !== "undefined" &&
      Boolean(window.location.hash) &&
      window.location.hash !== "#";
    if (lenis) {
      if (!hasHash) {
        lenis.scrollTo(0, { immediate: true });
      }
      lenis.resize();
    } else if (!hasHash) {
      window.scrollTo(0, 0);
    }
    ScrollTrigger.refresh();
  }, [pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    ScrollTrigger.refresh();

    const onClickCapture = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      /* El menú full-screen maneja su propio scroll + cierre; si interceptamos aquí a veces Lenis está en stop y no hay fallback. */
      if (t?.closest("#site-nav-overlay")) return;

      const a = t?.closest?.("a");
      if (!(a instanceof HTMLAnchorElement)) return;
      if (a.target === "_blank" || a.download) return;
      if (a.origin !== window.location.origin) return;

      let hash: string;
      try {
        const url = new URL(a.href);
        if (!url.hash || url.hash === "#") return;
        hash = url.hash;
      } catch {
        return;
      }

      const id = decodeURIComponent(hash.slice(1));
      if (!id) return;

      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      /* Menú abierto: Lenis en stop(); force evita return temprano. */
      lenis.scrollTo(el, { offset: -72, duration: 1.6, force: true });
    };

    document.addEventListener("click", onClickCapture, true);

    return () => {
      document.removeEventListener("click", onClickCapture, true);
      setLenisInstance(null);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
