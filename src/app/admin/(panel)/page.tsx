import Link from "next/link";

type Card = {
  href: string;
  title: string;
  description: string;
};

type Section = {
  title: string;
  subtitle: string;
  cards: Card[];
};

const SECTIONS: Section[] = [
  {
    title: "Catálogo",
    subtitle: "Piezas y colecciones que ve el visitante",
    cards: [
      {
        href: "/admin/categories",
        title: "Categorías",
        description: "Crear, renombrar o eliminar las secciones del catálogo (gabinetes, sillas, etc.).",
      },
      {
        href: "/admin/products",
        title: "Productos",
        description:
          "Cada pieza: fotos, medidas, textos y galería. El precio es opcional (consulta por WhatsApp).",
      },
      {
        href: "/admin/featured",
        title: "Destacados en el inicio",
        description: "Las cuatro fichas de la home que enlazan a productos concretos.",
      },
    ],
  },
  {
    title: "Opciones al cotizar",
    subtitle: "Listas que aparecen en la ficha de cada producto",
    cards: [
      {
        href: "/admin/maderas",
        title: "Maderas",
        description: "Especies del desplegable «Madera» (pino, cedro, quina, etc.).",
      },
      {
        href: "/admin/acabados",
        title: "Acabados",
        description: "Tipos de acabado del desplegable «Acabado» (mate, brillante, etc.).",
      },
    ],
  },
  {
    title: "Apariencia del sitio",
    subtitle: "Fotos fijas fuera del catálogo",
    cards: [
      {
        href: "/admin/site-images",
        title: "Imágenes del sitio",
        description:
          "Pantalla de carga con collage, hero del inicio, «Nuestra filosofía» y toda la página «Conocer más».",
      },
    ],
  },
];

export default function AdminHomePage() {
  return (
    <div className="space-y-10">
      <div className="border-b border-charcoal/10 pb-6">
        <h1 className="font-serif text-2xl text-charcoal sm:text-3xl">Panel principal</h1>
        <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-warm-gray">
          Elegí una sección del menú lateral o una tarjeta de abajo. Los archivos nuevos se
          guardan en el almacenamiento configurado (R2 o carpeta public/uploads).
        </p>
      </div>

      <div className="rounded-md border border-charcoal/10 bg-white px-4 py-3 font-sans text-sm text-warm-gray">
        <span className="font-medium text-charcoal">Tip:</span> después de cambiar imágenes del
        inicio, recargá la home con F5 para ver la pantalla de carga actualizada.
      </div>

      {SECTIONS.map((section) => (
        <section key={section.title} className="space-y-4">
          <div>
            <h2 className="font-serif text-xl text-charcoal">{section.title}</h2>
            <p className="mt-1 font-sans text-sm text-warm-gray">{section.subtitle}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm transition hover:border-charcoal/25 hover:shadow-md"
              >
                <h3 className="font-serif text-lg text-charcoal group-hover:text-charcoal">
                  {card.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-warm-gray">
                  {card.description}
                </p>
                <span className="mt-4 inline-block font-sans text-xs font-medium uppercase tracking-[0.12em] text-charcoal/50 group-hover:text-charcoal">
                  Abrir →
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
