"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CatalogImage from "@/components/CatalogImage";
import type { FeaturedHomeItem } from "@/data/catalog";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  items: FeaturedHomeItem[];
};

export default function FeaturedProducts({ items }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 64, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.35,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
          },
        }
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        const imgEl = card.querySelector(".product-img");
        const infoEl = card.querySelector(".product-info");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
          },
        });

        tl.fromTo(
          card,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.35,
            delay: i * 0.08,
            ease: "power3.inOut",
          }
        );

        if (imgEl) {
          tl.fromTo(
            imgEl,
            { scale: 1.18 },
            { scale: 1, duration: 1.55, ease: "power2.out" },
            "-=1.05"
          );
        }

        if (infoEl) {
          tl.fromTo(
            infoEl,
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.75, ease: "power3.out" },
            "-=0.55"
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="colección"
      className="section-editorial pt-[4.5rem] pb-12 md:pt-[6.5rem] md:pb-16"
    >
      <h2
        ref={titleRef}
        className="heading-display mb-12 text-center text-[clamp(2rem,4.8vw,3.75rem)] text-charcoal opacity-0 md:mb-16"
      >
        Descubre nuestras
        <br />
        piezas destacadas
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
        {items.map((product, i) => (
          <div
            key={`${product.productId}-${i}`}
            ref={(el) => {
              if (el) cardsRef.current[i] = el;
            }}
            className="group"
            style={{ clipPath: "inset(100% 0% 0% 0%)" }}
          >
            <Link
              href={product.href}
              className="block cursor-pointer no-underline"
            >
              <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-cream-dark">
                <CatalogImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="product-img object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.06]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              <div className="product-info">
                <p className="text-label tracking-[0.15em] text-charcoal">
                  {product.name}
                </p>
                <p className="text-label mt-1.5 text-warm-gray">{product.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
