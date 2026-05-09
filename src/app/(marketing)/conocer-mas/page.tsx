import type { Metadata } from "next";
import ConocerMasClient from "./ConocerMasClient";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Conocer más — Buitrago",
  description:
    "Tres generaciones de carpinteros. Descubre la historia, los valores y el proceso artesanal detrás de cada pieza Buitrago.",
};

export const dynamic = "force-dynamic";

export default async function ConocerMasPage() {
  const site = await getSiteContent();
  return (
    <ConocerMasClient
      images={{
        conocerMasHeroImage: site.conocerMasHeroImage,
        conocerMasStoryImage: site.conocerMasStoryImage,
        conocerMasProcesoImage: site.conocerMasProcesoImage,
        conocerMasCtaImage: site.conocerMasCtaImage,
      }}
    />
  );
}
