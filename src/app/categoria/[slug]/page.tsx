import { notFound } from "next/navigation";
import CatalogImage from "@/components/CatalogImage";
import Link from "next/link";
import { getCategory, getProductsByCategory } from "@/data/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) return {};
  return {
    title: `${cat.name} — Buitrago`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const items = await getProductsByCategory(slug);

  return (
    <main className="min-h-screen bg-cream">
      {/* ── Back + Breadcrumb ── */}
      <div className="section-editorial pt-5 pb-2 sm:pt-6">
        <Link
          href="/#categorías"
          className="inline-flex items-center gap-2 font-sans text-[0.72rem] text-charcoal/60 no-underline transition-colors hover:text-charcoal sm:gap-2.5 sm:text-[0.8rem]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-charcoal/15 text-[0.8rem] sm:h-8 sm:w-8 sm:text-[0.85rem]">
            ‹
          </span>
          Volver al inicio
        </Link>

        <nav className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 font-sans text-[0.65rem] text-warm-gray sm:text-[0.7rem]">
          <Link href="/" className="no-underline hover:text-charcoal transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/#categorías" className="no-underline hover:text-charcoal transition-colors">
            Categorías
          </Link>
          <span>/</span>
          <span className="text-charcoal">{category.name}</span>
        </nav>
      </div>

      {/* ── Hero split: info left + image right ── */}
      <section className="section-editorial pb-12 pt-5 sm:pb-16 sm:pt-6 md:pb-24 md:pt-8">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[1px] w-6 bg-charcoal/30" />
              <span className="text-label text-warm-gray">Catálogo</span>
            </div>
            <h1 className="heading-display text-[clamp(2.25rem,7vw,5rem)] text-charcoal">
              {category.name}
            </h1>
            <p className="text-body-elegant mt-4 max-w-md text-sm text-warm-gray sm:text-base">
              {category.tagline}
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-cream-dark">
            <CatalogImage
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ── Product grid ── */}
      <section className="section-editorial pb-20 md:pb-36">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 md:gap-10">
          {items.map((product) => (
            <Link
              key={product.id}
              href={`/categoria/${slug}/${product.id}`}
              className="group block no-underline"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
                <CatalogImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 33vw"
                />
                {/* Wood badge */}
                <span className="absolute left-2 top-2 rounded-sm bg-charcoal/80 px-2 py-1 font-sans text-[0.55rem] font-medium uppercase tracking-[0.12em] text-cream/95 backdrop-blur-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[0.6rem] sm:tracking-[0.15em]">
                  {product.woodBadge}
                </span>
              </div>

              <div className="mt-4 sm:mt-5">
                <h3 className="heading-editorial text-base text-charcoal sm:text-lg md:text-xl">
                  {product.name}
                </h3>
                <p className="mt-1.5 font-sans text-[0.7rem] leading-relaxed text-warm-gray line-clamp-2 sm:text-[0.75rem]">
                  {product.shortDescription}
                </p>

                <div className="mt-2 flex items-center gap-1.5 font-sans text-[0.68rem] text-charcoal/55 sm:mt-3 sm:text-[0.72rem]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                  <span className="truncate">{product.dimensions}</span>
                </div>

                <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-serif text-lg text-charcoal sm:text-xl md:text-[1.35rem]">
                    {product.price}
                  </span>
                  <span className="inline-flex w-fit items-center gap-2 rounded-sm border border-charcoal/20 px-3 py-1.5 font-sans text-[0.58rem] uppercase tracking-[0.16em] text-charcoal/70 transition-all duration-300 group-hover:border-charcoal group-hover:text-charcoal sm:px-4 sm:py-2 sm:text-[0.62rem] sm:tracking-[0.18em]">
                    Consultar
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
