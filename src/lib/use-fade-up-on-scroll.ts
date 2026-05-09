"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook de animación "fade + slide up" disparada por `ScrollTrigger`.
 *
 * Patrón que se repite en varias secciones editoriales del sitio: los bloques llegan desde
 * abajo mientras ganan opacidad cuando entran en viewport. Al concentrarlo aquí evitamos
 * registrar el plugin y replicar la misma `gsap.fromTo(...)` en cada componente.
 *
 * Uso típico:
 *
 * ```tsx
 * const titleRef = useRef<HTMLHeadingElement>(null);
 * useFadeUpOnScroll(titleRef);
 * return <h2 ref={titleRef} className="opacity-0">Hola</h2>;
 * ```
 *
 * Notas de diseño:
 * - Las opciones se leen una sola vez en el primer efecto (no reaccionan a cambios de
 *   identidad); esto permite pasar literales inline sin causar re-ejecuciones infinitas.
 * - El `trigger` puede ser distinto del elemento animado: útil para animar un hijo cuando
 *   un contenedor padre entra en viewport.
 * - Limpieza vía `gsap.context(...).revert()` — compatible con Strict Mode y rutas SPA.
 * - Requiere que el elemento destino arranque con `opacity-0` en CSS/Tailwind para evitar
 *   el flash previo al montaje del efecto.
 */

export type FadeUpOptions = {
  /** Distancia en px desde la que entra el elemento (default: 48). */
  y?: number;
  duration?: number;
  /** Segundos a esperar antes de la animación (default: 0). */
  delay?: number;
  /** Easing de GSAP (default: "power2.out"). */
  ease?: string;
  /** `scrollTrigger.start` de GSAP (default: "top 75%"). */
  start?: string;
  /**
   * Elemento cuyo cruce con la viewport dispara la animación. Por defecto es el propio
   * `targetRef`. Útil cuando varios hijos deben entrar a la vez que su sección padre.
   */
  triggerRef?: RefObject<Element | null>;
};

export function useFadeUpOnScroll(
  targetRef: RefObject<Element | null>,
  options: FadeUpOptions = {}
): void {
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const trigger = options.triggerRef?.current ?? target;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        target,
        { y: options.y ?? 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: options.duration ?? 1.35,
          delay: options.delay ?? 0,
          ease: options.ease ?? "power2.out",
          scrollTrigger: {
            trigger,
            start: options.start ?? "top 75%",
          },
        }
      );
    });

    return () => ctx.revert();
    // Se capturan opciones al montar: si el caller cambia parámetros en tiempo de vida del
    // componente, debería desmontarlo/remontarlo. Esto mantiene el hook trivial y predecible.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
