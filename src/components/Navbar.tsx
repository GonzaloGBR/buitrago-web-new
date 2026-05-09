"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import LogoMark, {
  LOGO_MARK_SIZE_CLASS,
  LOGO_MARK_SIZE_ONLY_CLASS,
} from "@/components/LogoMark";
import { getLenisInstance } from "@/lib/lenis-bridge";
import { SITE_CONTACT_EMAIL } from "@/lib/site-contact";

type NavbarProps = {
  siteChromeVisible: boolean;
};

/**
 * Velo del menú: opaco `bg-charcoal` (sin rgba ni blur) = mismo tono en todo el viewport.
 * La barra superior usa el mismo color al abrir + overlay sin fade-in para no “ver pasar” el hero.
 */
const MENU_OVERLAY_CLASS = "bg-charcoal";

/**
 * Menú abierto: overlay y nav por encima del resto del sitio.
 * Menú cerrado: overlay z-40 y nav z-50 (igual que antes) para no tapar Moodboard (z-95) ni intro.
 */
const MENU_OVERLAY_Z_OPEN = "z-[100]";
const NAV_Z_MENU_OPEN = "z-[110]";

export default function Navbar({ siteChromeVisible }: NavbarProps) {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /** Un frame en “cerrado” al abrir para que el navegador pinte translate/opacity inicial y corra la transición. */
  const [menuEnterReady, setMenuEnterReady] = useState(false);
  /** Sube en cada apertura del menú para remontar enlaces y repetir la animación. */
  const [menuAnimEpoch, setMenuAnimEpoch] = useState(0);
  /* Cliente-only para el portal: arranca `false` en SSR (no hay `document`) y `true` en el primer
     render del cliente. Evita un re-render extra causado por `useEffect` + `setState`. */
  const [overlayPortalReady] = useState(() => typeof document !== "undefined");
  /** Un frame sin transición de fondo al cerrar menú (evita “tira” carbón→crema). */
  const [navBgSnapClose, setNavBgSnapClose] = useState(false);
  /** Un frame sin transición al volver al hero (crema→transparente sin “desvanecer”). */
  const [navBgSnapHero, setNavBgSnapHero] = useState(false);
  const prevScrolledRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevScrolledRef.current === true && scrolled === false) {
      // Sincroniza con el cambio externo del scroll (no es estado derivado): un único
      // re-render para activar el "snap" del fondo durante 1 frame y deshacerse.
      setNavBgSnapHero(true);
    }
    prevScrolledRef.current = scrolled;
  }, [scrolled]);

  useEffect(() => {
    if (!navBgSnapHero) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setNavBgSnapHero(false));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [navBgSnapHero]);

  useEffect(() => {
    if (!navBgSnapClose) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setNavBgSnapClose(false));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [navBgSnapClose]);

  const closeMenu = useCallback(() => {
    setNavBgSnapClose(true);
    setMenuOpen(false);
  }, []);

  /** Hash del menú: fuera de SmoothScroll (overlay excluido) para evitar Lenis en stop sin scroll. */
  const goToMenuSection = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      e.stopPropagation();
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      const sameOrigin = url.origin === window.location.origin;
      const here =
        window.location.pathname.replace(/\/$/, "") || "/";
      const there = url.pathname.replace(/\/$/, "") || "/";
      const isOtherPage =
        sameOrigin && (there !== here || url.search !== window.location.search);

      if (isOtherPage && (!url.hash || url.hash === "#")) {
        try {
          getLenisInstance()?.start();
        } catch {
          /* noop */
        }
        /* No cerrar el menú aquí: si menuOpen pasa a false, el overlay hace fade y se ve la home
           un instante antes de que termine la navegación. Al desmontar el Navbar al cambiar de
           ruta, el efecto de bloqueo de scroll hace cleanup y el overlay desaparece con la vista. */
        router.push(`${url.pathname}${url.search}`);
        return;
      }

      if (!url.hash || url.hash === "#") return;
      const id = decodeURIComponent(url.hash.slice(1));

      try {
        getLenisInstance()?.start();
      } catch {
        /* noop */
      }

      closeMenu();

      const run = () => {
        const el = document.getElementById(id);
        const lenis = getLenisInstance();
        if (el && lenis) {
          lenis.resize();
          lenis.scrollTo(el, { offset: -72, duration: 1.6, force: true });
        } else if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top, behavior: "smooth" });
        }
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(run);
      });
    },
    [closeMenu, router]
  );

  const toggleMenu = useCallback(() => {
    if (menuOpen) closeMenu();
    else {
      setNavBgSnapClose(false);
      setMenuAnimEpoch((n) => n + 1);
      setMenuOpen(true);
    }
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById("hero");
      if (heroEl) {
        const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
        setScrolled(window.scrollY >= heroBottom - 60);
      } else {
        setScrolled(window.scrollY > 80);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    /* Coordina la transición del menú con el navegador: en cada apertura/cierre se necesita
       un frame de "false" para que el estilo inicial se pinte y el `transition` corra. Es
       sincronización legítima con un sistema externo (el render del browser), no estado derivado. */
    if (!menuOpen || !siteChromeVisible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMenuEnterReady(false);
      return;
    }
    setMenuEnterReady(false);
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setMenuEnterReady(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [menuOpen, siteChromeVisible]);

  /**
   * Bloquea scroll detrás del menú: Lenis sigue moviendo la página aunque body tenga overflow hidden,
   * así que además llamamos lenis.stop() / start() (ver globals `.lenis.lenis-stopped`).
   *
   * useLayoutEffect (no useEffect): al cerrar y hacer scroll con rAF, el cleanup debe correr antes del
   * paint; si no, body/html siguen en overflow:hidden y scrollTo no mueve la página.
   */
  useLayoutEffect(() => {
    const lock = menuOpen && siteChromeVisible;
    if (!lock) return;

    const lenis = getLenisInstance();
    lenis?.stop();

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyTouchAction = body.style.touchAction;
    const prevBodyPaddingRight = body.style.paddingRight;
    const scrollbarGap = window.innerWidth - html.clientWidth;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }

    return () => {
      try {
        lenis?.start();
      } catch {
        /* Lenis ya destruido al desmontar la app */
      }
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.touchAction = prevBodyTouchAction;
      body.style.paddingRight = prevBodyPaddingRight;
    };
  }, [menuOpen, siteChromeVisible]);

  useLayoutEffect(() => {
    if (!siteChromeVisible || !navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.15, ease: "power4.out" }
    );
  }, [siteChromeVisible]);

  const onDark = !scrolled && !menuOpen;
  /**
   * Variante del logo: claro sobre hero u overlay del menú (fondo oscuro).
   * Con scroll en sección clara el logo es oscuro; al abrir el menú volvemos a claro sin pintar la barra de negro.
   */
  const logoOnDark = !scrolled || menuOpen;
  /**
   * Botón menú estilo “sobre fondo claro” solo cuando hay scroll y el menú está cerrado.
   * Con menú abierto siempre estilo crema (overlay oscuro), aunque la página detrás sea blanca.
   */
  const menuBarOverLight = scrolled && !menuOpen;

  /** Logo + botón: sin tween de color el mismo frame que el fondo (hero / cerrar menú). */
  const navChromeInstant = navBgSnapHero || navBgSnapClose;

  /** Barra superior: al abrir menú mismo carbón que el overlay, sin transición (evita ver el hero “virar” durante el fade del velo). */
  const navSurface =
    menuOpen && siteChromeVisible
      ? "bg-charcoal"
      : scrolled
        ? "bg-cream backdrop-blur-none"
        : "bg-transparent";
  const navSurfaceTransition =
    menuOpen && siteChromeVisible
      ? "transition-none"
      : navBgSnapClose || navBgSnapHero
        ? "transition-none"
        : "transition-[background-color,backdrop-filter] duration-500 ease-out";

  const overlay = (
    <div
      id="site-nav-overlay"
      aria-hidden={!menuOpen || !siteChromeVisible}
      style={{
        transitionDuration:
          menuOpen && siteChromeVisible ? "0ms" : navBgSnapClose ? "0ms" : "380ms",
      }}
      className={`fixed top-0 left-0 right-0 bottom-0 flex h-[100svh] min-h-[100svh] w-full flex-col items-center justify-center overscroll-none ${MENU_OVERLAY_CLASS} transition-opacity ease-out [backface-visibility:hidden] ${
        menuOpen && siteChromeVisible ? MENU_OVERLAY_Z_OPEN : "z-40"
      } ${
        menuOpen && siteChromeVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        key={menuAnimEpoch}
        className={`flex flex-col items-center gap-3 md:gap-4 ${!menuOpen ? "[content-visibility:hidden]" : ""}`}
      >
        {[
          { label: "Colección", href: "#colección" },
          { label: "Nosotros", href: "#nosotros" },
          { label: "Contacto", href: "/contacto" },
        ].map((item, i) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => goToMenuSection(e, item.href)}
            className={`heading-display text-[clamp(2.5rem,11vw,4.5rem)] leading-tight text-cream hover:text-accent md:text-7xl ${
              menuOpen && siteChromeVisible
                ? "transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                : "transition-none"
            } ${
              menuOpen && siteChromeVisible && menuEnterReady
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-6 opacity-0"
            }`}
            style={{
              transitionDelay:
                menuOpen && siteChromeVisible && menuEnterReady
                  ? `${200 + i * 150}ms`
                  : "0ms",
            }}
          >
            {item.label}
          </a>
        ))}
      </div>

      <div
        className={`absolute bottom-[max(2rem,env(safe-area-inset-bottom))] flex flex-wrap justify-center gap-6 px-6 text-center sm:bottom-12 sm:gap-12 ${
          menuOpen && siteChromeVisible
            ? "transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
            : "transition-none"
        } ${
          menuOpen && siteChromeVisible && menuEnterReady
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0"
        }`}
        style={{
          transitionDelay:
            menuOpen && siteChromeVisible && menuEnterReady ? "680ms" : "0ms",
        }}
      >
        <a
          href={`mailto:${SITE_CONTACT_EMAIL}`}
          className="text-label text-warm-gray/90 transition-colors duration-500 hover:text-cream"
        >
          {SITE_CONTACT_EMAIL}
        </a>
        <a
          href="#"
          className="text-label text-warm-gray/90 transition-colors duration-500 hover:text-cream"
        >
          Instagram
        </a>
      </div>
    </div>
  );

  return (
    <>
      <nav
        ref={navRef}
        aria-hidden={!siteChromeVisible}
        className={`fixed top-0 left-0 w-full ${navSurfaceTransition} ${
          menuOpen && siteChromeVisible ? NAV_Z_MENU_OPEN : "z-50"
        } ${
          !siteChromeVisible ? "pointer-events-none invisible" : ""
        } ${navSurface}`}
      >
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:py-4 md:px-6 md:py-5">
          {/* Left — Logo */}
          <Link
            href="/"
            aria-label="Buitrago — inicio"
            className="z-10 flex h-[3.5rem] shrink-0 items-center justify-center sm:h-[4.5rem] md:h-[5rem]"
          >
            <LogoMark
              variant={logoOnDark ? "on-dark" : "on-light"}
              className={
                navChromeInstant
                  ? `${LOGO_MARK_SIZE_ONLY_CLASS} transition-none`
                  : LOGO_MARK_SIZE_CLASS
              }
            />
          </Link>

          {/* Right — Menu toggle */}
          <button
            type="button"
            onClick={toggleMenu}
            className="group z-10 flex shrink-0 cursor-pointer items-center gap-2 transition-transform duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] sm:gap-3.5"
            aria-expanded={menuOpen}
            aria-controls="site-nav-overlay"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <span
              className={`relative flex size-11 shrink-0 items-center justify-center rounded-full border ${
                navChromeInstant
                  ? "transition-none"
                  : "transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
              } ${
                menuOpen
                  ? menuBarOverLight
                    ? "border-charcoal/20 bg-charcoal/[0.06] shadow-sm"
                    : "border-cream/40 bg-cream/[0.07] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]"
                  : onDark
                    ? "border-cream/22 bg-cream/[0.04] group-hover:border-cream/35"
                    : "border-charcoal/12 bg-charcoal/[0.02] group-hover:border-charcoal/22"
              }`}
            >
              <span className="flex h-[13px] w-[17px] flex-col justify-between" aria-hidden>
                <span
                  className={`block h-[1.5px] w-full origin-center rounded-full ${
                    navChromeInstant
                      ? "transition-none"
                      : "transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  } ${
                    menuOpen
                      ? menuBarOverLight
                        ? "translate-y-[5.75px] rotate-45 bg-charcoal"
                        : "translate-y-[5.75px] rotate-45 bg-cream"
                      : onDark
                        ? "bg-cream"
                        : "bg-charcoal"
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-full rounded-full ${
                    navChromeInstant ? "transition-none" : "transition-all duration-400 ease-out"
                  } ${
                    menuOpen
                      ? menuBarOverLight
                        ? "scale-x-0 opacity-0 bg-charcoal"
                        : "scale-x-0 opacity-0 bg-cream"
                      : onDark
                        ? "bg-cream"
                        : "bg-charcoal"
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-full origin-center rounded-full ${
                    navChromeInstant
                      ? "transition-none"
                      : "transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  } ${
                    menuOpen
                      ? menuBarOverLight
                        ? "-translate-y-[5.75px] -rotate-45 bg-charcoal"
                        : "-translate-y-[5.75px] -rotate-45 bg-cream"
                      : onDark
                        ? "bg-cream"
                        : "bg-charcoal"
                  }`}
                />
              </span>
            </span>
            <span
              className={`hidden text-label tracking-[0.28em] sm:inline ${
                navChromeInstant ? "transition-none" : "transition-colors duration-500"
              } ${
                menuOpen
                  ? menuBarOverLight
                    ? "text-charcoal"
                    : "text-cream"
                  : onDark
                    ? "text-cream"
                    : "text-charcoal"
              }`}
            >
              Menú
            </span>
          </button>
        </div>
      </nav>

      {overlayPortalReady ? createPortal(overlay, document.body) : overlay}
    </>
  );
}
