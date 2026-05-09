/**
 * Regla única de la intro (preloader + moodboard):
 *
 * Se reproduce **solo una vez** en la vida del documento, y **únicamente** si ese documento se
 * cargó directamente en la home (`/`) como:
 *   1. Una **primera visita** — usuario tipea/pega la URL, toca un link externo, etc.
 *      (`PerformanceNavigationTiming.type === "navigate"`).
 *   2. Un **reload** explícito (F5 / botón recargar) estando en `/` (type === "reload").
 *
 * Se salta cuando:
 *   - El tipo de navegación es `back_forward` (botón atrás/adelante del navegador).
 *   - El documento inicial de la pestaña fue otra ruta (p. ej. `/contacto`) y después el usuario
 *     navega SPA a la home: aunque `HomeClient` se monte, `initialDocumentPathname !== "/"` lo
 *     descarta.
 *   - Ya se reprodujo una vez en esta pestaña (flag `consumed`).
 *
 * Clave del diseño: usamos estado a **nivel de módulo** (no `sessionStorage`). Eso implica:
 *  - Se mantiene durante toda la vida de la pestaña aunque el componente `HomeClient` se remonte
 *    (cualquier nav SPA posterior ve `consumed = true` → no reproduce).
 *  - Se **borra automáticamente** cuando el navegador recarga el documento (F5), porque JS vuelve
 *    a evaluarse. Justo cuando queremos que la intro vuelva a considerarse.
 */

let decisionCache: boolean | null = null;
let consumed = false;

function initialDocumentPathname(nav: PerformanceNavigationTiming): string {
  if (!nav.name) return "/";
  try {
    return new URL(nav.name, window.location.origin).pathname.replace(/\/$/, "") || "/";
  } catch {
    return "/";
  }
}

function computeDecision(): boolean {
  if (typeof window === "undefined") return false;

  const nav = performance.getEntriesByType?.("navigation")?.[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (!nav) return false;

  /**
   * Solo aceptamos las dos formas de "entrada real" al documento:
   *  - "navigate": primera visita (tipear la URL, link externo, compartido por WhatsApp, etc.).
   *  - "reload":   F5 / botón de recargar.
   * Descartamos "back_forward" (botón atrás/adelante) y "prerender".
   */
  if (nav.type !== "reload" && nav.type !== "navigate") return false;

  /**
   * Exigimos que el documento se haya cargado originalmente en `/`. Esto evita reproducir la
   * intro cuando el usuario entró primero a otra página (p. ej. `/contacto`) y llega a la home
   * vía navegación SPA: aunque `HomeClient` se monte ahora, la entrada inicial no fue la home.
   */
  if (initialDocumentPathname(nav) !== "/") return false;

  /**
   * Y que en ESTE momento estemos efectivamente en `/`. Protege de casos raros donde el usuario
   * ya cambió de ruta entre el parseo del módulo y el primer render.
   */
  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  return currentPath === "/";
}

/**
 * Devuelve `true` si procede reproducir la intro en este momento.
 * Se puede llamar varias veces: la primera calcula, el resto devuelve el valor cacheado. Tras llamar a
 * `markHomeEntranceConsumed()` siempre devuelve `false` durante el resto de la vida del documento.
 */
export function shouldPlayFullHomeEntrance(): boolean {
  if (typeof window === "undefined") return false;
  if (consumed) return false;

  if (decisionCache === null) {
    decisionCache = computeDecision();
  }
  return decisionCache;
}

/**
 * Marca la decisión como consumida: a partir de esta llamada, cualquier remontaje de `HomeClient`
 * (SPA nav, back/forward, etc.) salta la intro. Solo un reload real del documento (que resetea el
 * estado del módulo) la vuelve a considerar.
 *
 * Importante: se debe llamar **después** del paint inicial (p. ej. desde un `useEffect`) para no
 * interferir con la doble invocación de efectos en React Strict Mode.
 */
export function markHomeEntranceConsumed(): void {
  consumed = true;
}
