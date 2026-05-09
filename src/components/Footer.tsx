import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import SaveContactButton from "@/components/SaveContactButton";
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
      <div className="section-editorial py-10 sm:py-12 md:py-14">
        <div className="grid gap-10 border-b border-white/[0.06] pb-10 md:grid-cols-[1fr_auto] md:items-end md:gap-14 md:pb-12">
          <div>
            <p className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.28em] text-cream/50">
              WhatsApp — historias del taller
            </p>
            <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-cream/70 sm:text-base">
              Guardá nuestro contacto y seguí el taller en{" "}
              <span className="text-cream/90">historias de WhatsApp</span>: proceso, maderas y piezas
              terminadas.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <SaveContactButton />
              <a
                href={SITE_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[0.8rem] text-cream/50 underline decoration-cream/25 underline-offset-4 transition-colors hover:text-cream/80 hover:decoration-cream/50"
              >
                Abrir WhatsApp
              </a>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className={headingCol}>Salta, Argentina</p>
            <p className="mt-2 font-sans text-sm text-cream/50">Español · AR</p>
          </div>
        </div>

        <div className="flex flex-col gap-12 pt-10 lg:flex-row lg:justify-between lg:gap-10 lg:pt-12">
          <div className="flex max-w-sm flex-col gap-5">
            <Link
              href="/"
              className="flex items-center gap-3 no-underline"
              aria-label="Buitrago — inicio"
            >
              <LogoMark variant="on-dark" className="h-10 w-auto sm:h-11" />
              <span className="heading-editorial text-xl text-cream sm:text-2xl">Buitrago</span>
            </Link>
            <p className="font-sans text-sm leading-relaxed text-cream/50">
              Carpintería artesanal y muebles de madera maciza a medida.
            </p>
            <a href={`mailto:${SITE_CONTACT_EMAIL}`} className={`${linkMuted} w-fit break-all`}>
              {SITE_CONTACT_EMAIL}
            </a>
            <a href={`tel:${SITE_CONTACT_PHONE_TEL}`} className={`${linkMuted} w-fit`}>
              {SITE_CONTACT_PHONE_DISPLAY}
            </a>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-12 lg:max-w-2xl lg:justify-items-end">
            <div className="flex flex-col gap-4">
              <p className={headingCol}>Catálogo</p>
              <nav className="flex flex-col gap-3" aria-label="Catálogo">
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
            <div className="flex flex-col gap-4">
              <p className={headingCol}>Estudio</p>
              <nav className="flex flex-col gap-3" aria-label="Estudio">
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
            <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
              <p className={headingCol}>Seguinos</p>
              <nav className="flex flex-col gap-3" aria-label="Redes sociales">
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

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:pt-9">
          <p className="text-center font-sans text-[0.7rem] uppercase tracking-[0.22em] text-cream/35 sm:text-left">
            © {new Date().getFullYear()} Buitrago
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:justify-end">
            <span className="font-sans text-[0.75rem] text-cream/40">Privacidad (próximamente)</span>
            <span className="font-sans text-[0.75rem] text-cream/40">Términos (próximamente)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
