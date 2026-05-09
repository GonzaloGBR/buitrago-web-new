import type Lenis from "lenis";

let instance: Lenis | null = null;

/** SmoothScroll registra aquí la instancia para modales/menú. */
export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenisInstance(): Lenis | null {
  return instance;
}
