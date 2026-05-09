import HomeClient from "./home-client";
import { getCategories, getFeaturedHomeProducts } from "@/data/catalog";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, featured, siteContent] = await Promise.all([
    getCategories(),
    getFeaturedHomeProducts(),
    getSiteContent(),
  ]);
  return (
    <HomeClient
      categories={categories}
      featured={featured}
      siteContent={siteContent}
    />
  );
}
