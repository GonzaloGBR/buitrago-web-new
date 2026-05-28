"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shouldUnoptimizeImage } from "@/lib/image-url";
import type { SiteContentValues } from "@/lib/site-content-defaults";

gsap.registerPlugin(ScrollTrigger);

export type ConocerMasImages = Pick<
  SiteContentValues,
  | "conocerMasHeroImage"
  | "conocerMasStoryImage"
  | "conocerMasProcesoImage"
  | "conocerMasCtaImage"
>;

const VALORES = [
  {
    num: "01",
    title: "Madera noble",
    text: "Trabajamos cedro, petiribí, quina y otras maderas de la región. Cada tabla se elige pieza por pieza, con la paciencia que pide el oficio.",
  },
  {
    num: "02",
    title: "Ensambles vivos",
    text: "Cola de milano, espigas pasantes, uniones que respiran con la madera. Sin tornillos visibles.",
  },
  {
    num: "03",
    title: "Acabados a mano",
    text: "Aceites, ceras y lacas naturales aplicadas en múltiples capas. El tacto final lo define la mano del carpintero.",
  },
];

const PROCESO = [
  {
    step: "Conversación",
    lead: "Primer encuentro",
    text: "Escuchamos. Cada proyecto nace en una charla larga: el espacio, los rituales, la luz. No hay dos encargos iguales.",
  },
  {
    step: "Diseño",
    lead: "Bocetos y planos",
    text: "Dibujamos la pieza en proporción, la validamos con maquetas a escala y definimos la madera y los herrajes.",
  },
  {
    step: "Taller",
    lead: "Manos sobre madera",
    text: "Cepillado, trazado, corte y ensamble. Cada operación sigue el orden que Rubén afinó durante décadas en su taller.",
  },
  {
    step: "Entrega",
    lead: "Instalación y cuidado",
    text: "Transportamos e instalamos nosotros. Te enseñamos cómo alimentar la madera para que envejezca con nobleza.",
  },
];

const MADERAS = [
  { nombre: "Cedro salteño", tono: "Cálido aromático", uso: "Muebles, guardados y piezas interiores" },
  { nombre: "Petiribí", tono: "Dorado veteado", uso: "Mesas y piezas centrales" },
  { nombre: "Quina colorada", tono: "Rojo profundo", uso: "Escritorios y detalles de autor" },
  { nombre: "Pino paranaense", tono: "Claro uniforme", uso: "Estructuras y complementos" },
];

/** Fotos editoriales con `next/image` (fill + sizes + calidad). */
function EditorialPhoto({
  src,
  alt,
  sizes,
  className = "object-cover",
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      quality={90}
      sizes={sizes}
      unoptimized={shouldUnoptimizeImage(src)}
      className={className}
    />
  );
}

export default function ConocerMasClient({ images }: { images: ConocerMasImages }) {
  const heroRef = useRef<HTMLElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroLabelRef = useRef<HTMLSpanElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);

  const storyRef = useRef<HTMLElement>(null);
  const valoresRef = useRef<HTMLElement>(null);
  const valoresCardsRef = useRef<HTMLDivElement[]>([]);

  const procesoRef = useRef<HTMLElement>(null);
  const procesoStepsRef = useRef<HTMLLIElement[]>([]);

  const linajeRef = useRef<HTMLElement>(null);
  const maderasRef = useRef<HTMLElement>(null);
  const maderasItemsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    /**
     * `useLayoutEffect` (no `useEffect`): garantiza que GSAP fije el estado inicial de los
     * elementos del hero antes del primer paint del cliente. Si usáramos `useEffect`, el browser
     * pintaría un frame con los elementos ya en posición final y luego GSAP los movería al
     * estado inicial → "salto" perceptible al entrar a la página.
     *
     * Nota adicional: todos los elementos animados tienen `opacity-0` (o `scale-x-0`) como clase
     * Tailwind base. Así salen invisibles del HTML SSR y solo aparecen por la animación, sin
     * flash entre hidratación y primer tick del efecto.
     */
    const ctx = gsap.context(() => {
      // HERO entry
      gsap.fromTo(
        heroLabelRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power3.out" }
      );
      gsap.fromTo(
        heroTitleRef.current,
        { y: 56, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, delay: 0.35, ease: "power3.out" }
      );
      gsap.fromTo(
        heroSubRef.current,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.15, delay: 0.55, ease: "power2.out" }
      );

      // STORY
      gsap.utils.toArray<HTMLElement>(".story-reveal").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            delay: i * 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          }
        );
      });

      // VALORES
      valoresCardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          }
        );
      });

      // PROCESO
      procesoStepsRef.current.forEach((row) => {
        if (!row) return;
        const num = row.querySelector(".proc-num");
        const body = row.querySelector(".proc-body");
        const line = row.querySelector(".proc-line");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 82%" },
        });
        if (line) tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0);
        if (num) tl.fromTo(num, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.1);
        if (body) tl.fromTo(body, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0.2);
      });

      // LINAJE
      gsap.utils.toArray<HTMLElement>(".linaje-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.25,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          }
        );
      });

      // MADERAS
      maderasItemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            delay: i * 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 88%" },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-cream text-charcoal">
      {/* ─────────── HERO ─────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        aria-label="Presentación Conocer más"
      >
        {/* Alejar la foto: capa grande con escala compensada para cubrir sin bandas */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[188%] w-[188%] origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.52] sm:h-[156%] sm:w-[156%] sm:scale-[0.64] md:h-[139%] md:w-[139%] md:scale-[0.72]">
            <div className="relative h-full w-full">
              <EditorialPhoto
                src={images.conocerMasHeroImage}
                alt="Cajonera de madera noble Buitrago en ambiente de interior"
                sizes="100vw"
                priority
                className="object-cover object-[34%_84%] brightness-[1.02] saturate-[1.04] sm:object-[50%_80%] md:object-[50%_78%]"
              />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {/* Móvil: mueble centrado detrás del texto; oscurecer solo la base */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(22,20,18,0.88)_0%,rgba(22,20,18,0.5)_38%,rgba(22,20,18,0.12)_62%,transparent_78%)] sm:hidden" />
          {/* Tablet/desktop: texto a la derecha */}
          <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_95%_85%_at_100%_100%,rgba(22,20,18,0.78)_0%,rgba(22,20,18,0.42)_48%,transparent_72%)] sm:block" />
          <div className="absolute inset-0 hidden bg-[linear-gradient(285deg,rgba(22,20,18,0.62)_0%,rgba(22,20,18,0.22)_42%,transparent_68%)] sm:block" />
          <div className="absolute inset-0 hidden bg-[linear-gradient(to_top,rgba(22,20,18,0.38)_0%,transparent_48%)] sm:block" />
        </div>

        <div className="section-editorial relative flex min-h-[78svh] flex-col items-stretch justify-end pb-10 pt-28 text-left sm:min-h-[70svh] sm:items-end sm:pb-16 sm:pt-32 sm:text-right md:min-h-[78svh] md:pb-24 md:pt-40">
          <div className="w-full max-w-none [text-shadow:0_2px_28px_rgba(22,20,18,0.65)] sm:max-w-2xl">
            <span
              ref={heroLabelRef}
              className="text-label mb-5 block text-cream/85 opacity-0 sm:mb-6"
            >
              Nuestra historia
            </span>
            <h1
              ref={heroTitleRef}
              className="heading-display max-w-[18ch] text-[clamp(2.25rem,8vw,5.75rem)] leading-[1.02] text-cream opacity-0"
            >
              La nobleza de lo
              <br />
              hecho <span className="italic text-accent">a mano</span>
            </h1>
            <p
              ref={heroSubRef}
              className="mt-6 max-w-xl text-sm leading-relaxed text-cream/90 opacity-0 sm:mt-8 sm:text-base"
            >
              En Salta, Rubén Buitrago aprendió el oficio con máquinas hechas a
              mano y una obsesión por hacer las cosas bien. Hoy, su hijo
              Gonzalo lleva ese fuego en el mismo taller.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── STORY · intro + detalle ─────────── */}
      <section
        ref={storyRef}
        className="section-editorial section-y-loose"
        aria-label="Quiénes somos"
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16 lg:gap-24">
          <div className="story-reveal order-2 opacity-0 md:order-1">
            <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
              <EditorialPhoto
                src={images.conocerMasStoryImage}
                alt="Detalle de ensamblaje — unión a cola de milano"
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover transition-transform duration-[2.2s] ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.03]"
              />
            </div>
            <p className="mt-4 font-serif text-xs italic text-warm-gray sm:text-sm">
              Ensamble a cola de milano — petiribí seleccionado a mano.
            </p>
          </div>

          <div className="order-1 md:order-2 md:pt-6">
            <span className="story-reveal text-label mb-5 block text-warm-gray opacity-0 sm:mb-6">
              Origen
            </span>
            <h2 className="story-reveal heading-editorial mb-6 text-[clamp(1.875rem,5.5vw,3rem)] leading-[1.12] text-charcoal opacity-0 sm:mb-8 md:text-5xl">
              Un apellido,
              <br />
              <span className="text-warm-gray">un oficio de verdad.</span>
            </h2>
            <p className="story-reveal text-body-elegant mb-5 max-w-md text-sm text-warm-gray opacity-0 sm:mb-6 sm:text-base">
              Todo empezó con Rubén Buitrago. Llegó al oficio en Salta capital,
              trabajando como empleado en un taller ajeno, con máquinas de madera
              hechas a mano y la convicción de aprender cada detalle desde adentro.
            </p>
            <p className="story-reveal text-body-elegant mb-5 max-w-md text-sm text-warm-gray opacity-0 sm:mb-6 sm:text-base">
              Cuando supo que era hora de ir por su propio camino, compró su
              terreno y fue armando el taller pieza por pieza: comprando herramientas,
              fabricando máquinas, trabajando durante décadas con la misma
              constancia de quien construye algo propio sin atajos.
            </p>
            <p className="story-reveal text-body-elegant mb-5 max-w-md text-sm text-warm-gray opacity-0 sm:mb-6 sm:text-base">
              Lo que Rubén construyó no quedó en el pasado. Hoy vive en
              Gonzalo —su hijo—, que tomó el relevo con la misma pasión:
              escuchar antes de diseñar, elegir bien la madera y trabajar sin
              prisa, porque un mueble digno de llevar este apellido no admite
              atajos.
            </p>
            <p className="story-reveal text-body-elegant max-w-md text-sm italic text-charcoal/70 opacity-0 sm:text-base">
              “Mi padre no dejó solo un taller. Dejó un modo de hacer las
              cosas. Eso es lo que hoy firmo con cada pieza que sale de acá.”
            </p>
            <p className="story-reveal mt-3 font-serif text-xs text-warm-gray opacity-0 sm:text-sm">
              — Gonzalo Buitrago
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── VALORES ─────────── */}
      <section
        ref={valoresRef}
        className="border-y border-sand/40 bg-cream-dark/40"
      >
        <div className="section-editorial section-y-loose">
          <div className="mb-12 max-w-2xl sm:mb-16">
            <span className="text-label mb-4 block text-warm-gray sm:mb-5">
              Tres principios
            </span>
            <h2 className="heading-editorial text-[clamp(1.875rem,5.5vw,3rem)] leading-[1.12] text-charcoal md:text-5xl">
              Lo que nos
              <br />
              <span className="text-warm-gray">vuelve Buitrago.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-10 lg:gap-14">
            {VALORES.map((v, i) => (
              <div
                key={v.num}
                ref={(el) => {
                  if (el) valoresCardsRef.current[i] = el;
                }}
                className="border-t border-charcoal/20 pt-6 opacity-0 sm:pt-8"
              >
                <span className="font-serif text-xs tracking-[0.3em] text-accent">
                  {v.num}
                </span>
                <h3 className="heading-editorial mt-4 text-xl text-charcoal sm:mt-5 sm:text-2xl">
                  {v.title}
                </h3>
                <p className="text-body-elegant mt-3 text-sm text-warm-gray sm:mt-4 sm:text-base">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── PROCESO ─────────── */}
      <section
        ref={procesoRef}
        className="section-editorial section-y-loose"
        aria-label="Proceso de trabajo"
      >
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
          <div className="md:sticky md:top-28">
            <span className="text-label mb-4 block text-warm-gray sm:mb-5">
              El proceso
            </span>
            <h2 className="heading-editorial mb-6 text-[clamp(1.875rem,5.5vw,3rem)] leading-[1.12] text-charcoal sm:mb-8 md:text-5xl">
              De la primera
              <br />
              charla al <span className="italic text-accent">último corte</span>.
            </h2>
            <p className="text-body-elegant max-w-sm text-sm text-warm-gray sm:text-base">
              Cada mueble atraviesa cuatro etapas. No hay atajos: cada una lleva
              el tiempo que pide la madera, no el que marca el calendario.
            </p>

            <div className="relative mt-10 aspect-[4/5] w-full max-w-md overflow-hidden bg-cream-dark sm:mt-12">
              <EditorialPhoto
                src={images.conocerMasProcesoImage}
                alt="Taller Buitrago en actividad"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>

          <ol className="space-y-10 sm:space-y-14">
            {PROCESO.map((p, i) => (
              <li
                key={p.step}
                ref={(el) => {
                  if (el) procesoStepsRef.current[i] = el;
                }}
                className="relative"
              >
                <span
                  className="proc-line absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-charcoal/15"
                  aria-hidden
                />
                <div className="pt-6 sm:pt-8">
                  <span className="proc-num block font-serif text-xs tracking-[0.3em] text-accent opacity-0">
                    · {String(i + 1).padStart(2, "0")} ·
                  </span>
                  <div className="proc-body mt-4 grid grid-cols-1 gap-4 opacity-0 sm:mt-5 sm:grid-cols-[10rem_1fr] sm:gap-8">
                    <div>
                      <p className="text-label text-warm-gray">{p.step}</p>
                      <p className="heading-editorial mt-1 text-lg text-charcoal sm:text-xl">
                        {p.lead}
                      </p>
                    </div>
                    <p className="text-body-elegant text-sm text-warm-gray sm:text-base">
                      {p.text}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─────────── LINAJE — 3 generaciones ─────────── */}
      <section
        ref={linajeRef}
        className="relative overflow-hidden bg-charcoal text-cream"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(247,245,240,0.3) 1px, transparent 0)",
              backgroundSize: "42px 42px",
            }}
          />
        </div>

        <div className="section-editorial section-y-loose relative">
          <div className="mb-12 max-w-2xl sm:mb-16">
            <span className="text-label mb-4 block text-warm-gray sm:mb-5">
              Linaje
            </span>
            <h2 className="heading-editorial text-[clamp(1.875rem,5.5vw,3rem)] leading-[1.12] text-cream md:text-5xl">
              Padre e hijo,
              <br />
              <span className="text-accent">un mismo taller.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            {[
              {
                year: "Salta",
                name: "Rubén Buitrago",
                role: "El origen",
                text: "Empezó como empleado en un taller de la capital salteña, aprendiendo el oficio con máquinas de madera hechas a mano y la disciplina de quien observa antes de actuar.",
              },
              {
                year: "Décadas",
                name: "El taller propio",
                role: "Construido paso a paso",
                text: "Compró su terreno y fue armando el espacio de trabajo poco a poco: herramientas, máquinas, experiencia. Así trabajó durante décadas, sin prisa y sin renunciar a la calidad.",
              },
              {
                year: "Hoy",
                name: "Gonzalo Buitrago",
                role: "Segunda generación",
                text: "Hoy Gonzalo continúa la historia que Rubén empezó: el mismo taller, las maderas de la región y la convicción de que cada pieza lleva algo de quienes somos.",
              },
            ].map((g) => (
              <article
                key={g.year}
                className="linaje-card relative border border-cream/10 bg-cream/[0.04] p-6 opacity-0 sm:p-8"
              >
                <span className="font-serif text-xs tracking-[0.3em] text-accent">
                  {g.year}
                </span>
                <h3 className="heading-editorial mt-4 text-2xl text-cream sm:mt-5 sm:text-[1.65rem]">
                  {g.name}
                </h3>
                <p className="text-label mt-1 text-warm-gray-light">{g.role}</p>
                <p className="text-body-elegant mt-5 text-sm text-cream/75 sm:mt-6 sm:text-base">
                  {g.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── MADERAS ─────────── */}
      <section
        ref={maderasRef}
        className="section-editorial section-y-loose"
        aria-label="Maderas que trabajamos"
      >
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-label mb-4 block text-warm-gray sm:mb-5">
              Materia prima
            </span>
            <h2 className="heading-editorial text-[clamp(1.875rem,5.5vw,3rem)] leading-[1.12] text-charcoal md:text-5xl">
              Maderas que
              <br />
              <span className="text-warm-gray">envejecen bien.</span>
            </h2>
          </div>
          <p className="max-w-sm font-sans text-sm text-warm-gray sm:text-base">
            Elegimos especies nativas por su comportamiento a través del tiempo,
            no por moda. Cedro, petiribí, quina y otras maderas de la región,
            seleccionadas con criterio antes de llegar al banco de trabajo.
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-charcoal/10 border-y border-charcoal/10 sm:grid-cols-2 sm:divide-y-0 md:grid-cols-4">
          {MADERAS.map((m, i) => (
            <div
              key={m.nombre}
              ref={(el) => {
                if (el) maderasItemsRef.current[i] = el;
              }}
              className="px-1 py-6 opacity-0 sm:border-r sm:border-charcoal/10 sm:px-5 sm:py-8 sm:last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 md:px-6 md:[&:nth-child(2n)]:border-r md:last:border-r-0 md:[&:nth-child(4n)]:border-r-0"
            >
              <span className="font-serif text-xs tracking-[0.3em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="heading-editorial mt-3 text-lg text-charcoal sm:mt-4 sm:text-xl">
                {m.nombre}
              </h3>
              <p className="text-label mt-2 text-warm-gray">{m.tono}</p>
              <p className="text-body-elegant mt-3 text-sm text-warm-gray/90 sm:text-[0.92rem]">
                {m.uso}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── CTA FINAL ─────────── */}
      <section className="relative overflow-hidden bg-charcoal text-cream">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="relative h-full w-full">
            <EditorialPhoto
              src={images.conocerMasCtaImage}
              alt=""
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-charcoal/75" />
        </div>

        <div className="section-editorial section-y-loose relative text-center">
          <span className="text-label mb-5 block text-warm-gray sm:mb-6">
            El siguiente paso
          </span>
          <h2 className="heading-display mx-auto max-w-[18ch] text-[clamp(2rem,6.5vw,4.5rem)] leading-[1.05] text-cream">
            Cuéntanos qué pieza
            <br />
            <span className="italic text-accent">imaginas.</span>
          </h2>
          <p className="text-body-elegant mx-auto mt-6 max-w-lg text-sm text-cream/75 sm:mt-8 sm:text-base">
            Los mejores proyectos empiezan con una conversación. Sin compromiso,
            sin fórmulas: solo tu idea y la madera correcta para llevarla al
            mundo.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-5">
            <Link
              href="/contacto"
              className="btn-editorial-light no-underline"
            >
              <span>Hablemos de tu proyecto</span>
              <span>→</span>
            </Link>
            <Link
              href="/#colección"
              className="inline-flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-cream/70 no-underline transition-colors hover:text-accent"
            >
              <span>Ver colección</span>
              <span aria-hidden>↓</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
