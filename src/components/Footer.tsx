export default function Footer() {
  return (
    <footer className="border-t border-warm-gray/10 bg-charcoal py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="section-editorial flex flex-col items-center justify-between gap-5 text-center md:flex-row md:gap-6 md:text-left">
        <span className="heading-editorial text-lg text-cream/40">
          Buitrago
        </span>
        <p className="text-label text-[10px] tracking-[0.25em] text-warm-gray/50 sm:text-[10.5px] sm:tracking-[0.3em] md:text-[9px] md:text-warm-gray/40">
          © {new Date().getFullYear()} Buitrago — Carpintería Artesanal
        </p>
        <div className="flex gap-5 sm:gap-6">
          <a
            href="#"
            className="text-label text-[10px] text-warm-gray/50 transition-colors duration-500 hover:text-cream/60 md:text-[9px] md:text-warm-gray/40"
          >
            Privacidad
          </a>
          <a
            href="#"
            className="text-label text-[10px] text-warm-gray/50 transition-colors duration-500 hover:text-cream/60 md:text-[9px] md:text-warm-gray/40"
          >
            Términos
          </a>
        </div>
      </div>
    </footer>
  );
}
