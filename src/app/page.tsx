import HomeClient from "./home-client";
import { getCategories, getFeaturedHomeProducts } from "@/data/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedHomeProducts(),
  ]);
  return <HomeClient categories={categories} featured={featured} />;
}
