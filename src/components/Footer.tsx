import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import {
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE_DISPLAY,
  SITE_CONTACT_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site-contact";

const linkMuted =
  "font-sans text-[0.8125rem] text-cream/55 transition-colors duration-300 hover:text-cream/90";

const headingCol =
  "font-sans text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-cream/40";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-charcoal pb-[max(2rem,env(safe-area-inset-bottom))] text-cream">
      <div className="section-editorial py-8 sm:py-12 md:py-14">
        <div className="grid gap-8 border-b border-white/[0.06] pb-8 md:grid-cols-[1fr_auto] md:items-end md:gap-14 md:pb-12">
          <div>
            <p className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.28em] text-cream/50">
              WhatsApp — historias del taller
            </p>
            <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-cream/70 sm:text-base">
              Seguí el taller en{" "}
              <span className="text-cream/90">historias de WhatsApp</span>: proceso, maderas y piezas
              terminadas.
            </p>
            <div className="mt-5 sm:mt-6">
              <a
                href={SITE_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-editorial-light inline-flex min-h-[2.75rem] items-center justify-center border-cream/35 px-8 text-cream no-underline"
              >
                <span>Abrir WhatsApp</span>
              </a>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className={headingCol}>Salta, Argentina</p>
            <p className="mt-2 font-sans text-sm text-cream/50">Español · AR</p>
          </div>
        </div>

        <div className="flex flex-col gap-8 pt-8 lg:flex-row lg:justify-between lg:gap-10 lg:pt-12">
          <div className="flex w-full flex-col gap-3 sm:max-w-sm sm:gap-5">
            {/* Header / Logo + Icons Row */}
            <div className="flex w-full items-center justify-between sm:justify-start">
              <Link
                href="/"
                className="flex items-center gap-3 no-underline"
                aria-label="Buitrago — inicio"
              >
                <LogoMark variant="on-dark" className="h-10 w-auto sm:h-11" />
              </Link>

              {/* Mobile social icons */}
              <div className="flex items-center gap-5 text-cream/70 sm:hidden">
                <a href={`mailto:${SITE_CONTACT_EMAIL}`} aria-label="Correo" className="transition-colors hover:text-cream">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </a>
                <a href={SITE_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="transition-colors hover:text-cream">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-cream">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              </div>
            </div>

            <p className="hidden font-sans text-sm leading-relaxed text-cream/50 sm:block">
              Carpintería artesanal y muebles de madera maciza a medida.
            </p>
            <a href={`mailto:${SITE_CONTACT_EMAIL}`} className={`hidden w-fit break-all ${linkMuted} sm:block`}>
              {SITE_CONTACT_EMAIL}
            </a>
            <a href={`tel:${SITE_CONTACT_PHONE_TEL}`} className={`hidden w-fit ${linkMuted} sm:block`}>
              {SITE_CONTACT_PHONE_DISPLAY}
            </a>
          </div>

          <div className="hidden flex-1 sm:grid sm:grid-cols-3 sm:gap-12 lg:max-w-2xl lg:justify-items-end">
            <div className="hidden flex-col gap-3 sm:flex sm:gap-4">
              <p className={headingCol}>Catálogo</p>
              <nav className="flex flex-col gap-2 sm:gap-3" aria-label="Catálogo">
                <Link href="/#colección" className={linkMuted}>
                  Colección
                </Link>
                <Link href="/#categorías" className={linkMuted}>
                  Categorías
                </Link>
                <Link href="/#nosotros" className={linkMuted}>
                  Filosofía
                </Link>
                <Link href="/#contacto" className={linkMuted}>
                  Contacto (inicio)
                </Link>
              </nav>
            </div>
            <div className="hidden flex-col gap-3 sm:flex sm:gap-4">
              <p className={headingCol}>Estudio</p>
              <nav className="flex flex-col gap-2 sm:gap-3" aria-label="Estudio">
                <Link href="/" className={linkMuted}>
                  Inicio
                </Link>
                <Link href="/conocer-mas" className={linkMuted}>
                  Conocer más
                </Link>
                <Link href="/contacto" className={linkMuted}>
                  Escribinos
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-3 sm:col-span-1 sm:gap-4">
              <p className={headingCol}>Seguinos</p>
              <nav className="flex flex-col gap-2 sm:gap-3" aria-label="Redes sociales">
                <a
                  href={SITE_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkMuted}
                >
                  WhatsApp
                </a>
                <a href="#" className={linkMuted}>
                  Instagram
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-white/[0.06] pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:pt-9">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.22em] text-cream/35">
            © {new Date().getFullYear()} Buitrago
          </p>
          <div className="flex flex-wrap gap-5 sm:justify-end sm:gap-6">
            <span className="font-sans text-[0.75rem] text-cream/40">Privacidad (próximamente)</span>
            <span className="font-sans text-[0.75rem] text-cream/40">Términos (próximamente)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
