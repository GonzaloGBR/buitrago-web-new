/**
 * Utilidades puramente cliente-side para detectar capacidades/preferencias del dispositivo.
 * Pensadas para que la intro del home pueda **acortar o saltar** su animación cuando:
 *  - El usuario prefiere menos movimiento (accesibilidad).
 *  - El dispositivo es de gama baja (poca RAM/CPU).
 *  - La conexión es lenta (2g, slow-2g, saveData on).
 *  - La ventana es chica (móvil) — aquí devolvemos el dato, la decisión la toma el caller.
 *
 * Todas las funciones son SAFE para llamar desde server (devuelven false/valor neutro) gracias
 * a los `typeof window === "undefined"` gates.
 */

/** Tipado mínimo de la API NetworkInformation (aún experimental, no está en lib.dom.d.ts). */
type ConnectionLike = {
  effectiveType?: string;
  saveData?: boolean;
};

/** `navigator` extendido con las APIs experimentales que usamos. */
type NavigatorExt = Navigator & {
  connection?: ConnectionLike;
  mozConnection?: ConnectionLike;
  webkitConnection?: ConnectionLike;
  deviceMemory?: number;
  hardwareConcurrency?: number;
};

function getConnection(): ConnectionLike | undefined {
  if (typeof navigator === "undefined") return undefined;
  const n = navigator as NavigatorExt;
  return n.connection ?? n.mozConnection ?? n.webkitConnection;
}

/** True si el SO/navegador pide animaciones reducidas. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/**
 * True si el dispositivo / conexión son claramente limitados. Usado como señal para acortar
 * la intro (no para saltarla: eso lo decide `prefersReducedMotion`).
 *
 * Heurística conservadora (solo marca "low-end" cuando hay evidencia clara):
 *  - `saveData: true` del usuario → honramos la pista.
 *  - `effectiveType` 2g / slow-2g.
 *  - `deviceMemory <= 1` (1 GB): la mayoría de móviles modernos tienen ≥2.
 *  - `hardwareConcurrency <= 2`: raro en 2024+, mejor no bajar más el umbral.
 */
export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false;
  const c = getConnection();
  if (c?.saveData) return true;
  if (c?.effectiveType === "2g" || c?.effectiveType === "slow-2g") return true;

  const n = navigator as NavigatorExt;
  if (typeof n.deviceMemory === "number" && n.deviceMemory <= 1) return true;
  if (typeof n.hardwareConcurrency === "number" && n.hardwareConcurrency <= 2) return true;

  return false;
}

/** True si el viewport es "móvil" (< 768px). Útil para aplicar timings más ágiles. */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}
