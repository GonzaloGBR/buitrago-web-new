"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VALORES = [
  {
    num: "01",
    title: "Madera noble",
    text: "Trabajamos con robles, nogales y cerezos curados al aire durante años. Cada tabla se elige pieza por pieza.",
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
    text: "Cepillado, trazado, corte y ensamble. Cada operación sigue el orden que tres generaciones afinaron.",
  },
  {
    step: "Entrega",
    lead: "Instalación y cuidado",
    text: "Transportamos e instalamos nosotros. Te enseñamos cómo alimentar la madera para que envejezca con nobleza.",
  },
];

const MADERAS = [
  { nombre: "Roble europeo", tono: "Cálido medio", uso: "Mesas y estanterías" },
  { nombre: "Nogal americano", tono: "Chocolate profundo", uso: "Escritorios y piezas centrales" },
  { nombre: "Cerezo", tono: "Rojizo cálido", uso: "Sillas y piezas pequeñas" },
  { nombre: "Fresno", tono: "Claro veteado", uso: "Detalles y contrastes" },
];

export default function ConocerMasClient() {
  const heroRef = useRef<HTMLElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
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
        heroImgRef.current,
        { scale: 1.12 },
        { scale: 1, duration: 2.2, ease: "power3.out" }
      );
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
        <div
          ref={heroImgRef}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/workshop.png"
            alt="Taller Buitrago: manos y herramientas sobre madera"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(22,20,18,0.72)_0%,rgba(22,20,18,0.45)_45%,rgba(22,20,18,0.25)_100%)]" />
        </div>

        <div className="section-editorial relative flex min-h-[70svh] flex-col justify-end pb-12 pt-24 sm:pb-16 sm:pt-32 md:min-h-[78svh] md:pb-24 md:pt-40">
          <span
            ref={heroLabelRef}
            className="text-label mb-5 block text-cream/70 opacity-0 sm:mb-6"
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
            className="mt-6 max-w-xl text-sm leading-relaxed text-cream/80 opacity-0 sm:mt-8 sm:text-base"
          >
            Somos Buitrago. Tres generaciones de carpinteros trabajando madera
            noble en un taller donde cada herramienta tiene nombre y cada pieza,
            una historia que merece contarse.
          </p>
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
              <Image
                src="/detail-joinery.png"
                alt="Detalle de ensamblaje — unión a cola de milano"
                fill
                className="object-cover transition-transform duration-[2.2s] ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
            <p className="mt-4 font-serif text-xs italic text-warm-gray sm:text-sm">
              Unión a cola de milano — roble europeo curado 6 años.
            </p>
          </div>

          <div className="order-1 md:order-2 md:pt-6">
            <span className="story-reveal text-label mb-5 block text-warm-gray opacity-0 sm:mb-6">
              Origen
            </span>
            <h2 className="story-reveal heading-editorial mb-6 text-[clamp(1.875rem,5.5vw,3rem)] leading-[1.12] text-charcoal opacity-0 sm:mb-8 md:text-5xl">
              Un oficio que
              <br />
              <span className="text-warm-gray">no se enseña en libros.</span>
            </h2>
            <p className="story-reveal text-body-elegant mb-5 max-w-md text-sm text-warm-gray opacity-0 sm:mb-6 sm:text-base">
              Buitrago nació en 1962 en un pequeño taller al norte de Buenos
              Aires. El abuelo, Don Emilio, llegó con una caja de herramientas
              heredada de su padre y la certeza de que un mueble bien hecho
              acompaña a una familia por generaciones.
            </p>
            <p className="story-reveal text-body-elegant mb-5 max-w-md text-sm text-warm-gray opacity-0 sm:mb-6 sm:text-base">
              Hoy el taller lo lleva la tercera generación. Cambiamos algunas
              máquinas, pero no los principios: escuchar al cliente, respetar
              la madera, tomarse el tiempo necesario.
            </p>
            <p className="story-reveal text-body-elegant max-w-md text-sm italic text-charcoal/70 opacity-0 sm:text-base">
              “Un mueble Buitrago no se termina cuando sale del taller.
              Termina cuando tus nietos todavía lo usan.”
            </p>
            <p className="story-reveal mt-3 font-serif text-xs text-warm-gray opacity-0 sm:text-sm">
              — Don Emilio Buitrago, fundador.
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
              <Image
                src="/workshop.png"
                alt="Taller Buitrago en actividad"
                fill
                className="object-cover"
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
              Tres generaciones,
              <br />
              <span className="text-accent">una misma mesa.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            {[
              {
                year: "1962",
                name: "Don Emilio",
                role: "Fundador",
                text: "Abre el taller con un banco, una sierra de mano y la disciplina aprendida de su padre, ebanista en Galicia.",
              },
              {
                year: "1988",
                name: "Ricardo",
                role: "Segunda generación",
                text: "Incorpora maquinaria sin renunciar a los ensambles tradicionales. Sistematiza el curado de la madera en los tiempos que pide cada especie.",
              },
              {
                year: "2014",
                name: "Martín y Lucía",
                role: "Tercera generación",
                text: "Traen el diseño contemporáneo y la colaboración con arquitectos. Abren el taller a los clientes: cada pieza se ve crecer.",
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
            Elegimos especies por su comportamiento a través del tiempo, no por
            moda. Todas pasan por un curado mínimo de cuatro años antes de
            llegar al banco de trabajo.
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
          <Image
            src="/detail-joinery.png"
            alt=""
            fill
            aria-hidden
            className="object-cover"
            sizes="100vw"
          />
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
