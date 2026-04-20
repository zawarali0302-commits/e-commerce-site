import { Hero } from "@/components/home/hero";
import { Ticker } from "@/components/home/ticker";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Editorial } from "@/components/home/editorial";
import { TrustBar } from "@/components/home/trust-bar";
import { Reviews } from "@/components/home/reviews";
import { Newsletter } from "@/components/home/newsletter";
import { getFeaturedProducts } from "@/lib/services/product.service";
import { getCategoriesWithCount } from "@/lib/services/category.service";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategoriesWithCount(),
  ]);

  return (
    <main className="min-h-screen">
      <Hero />
      <Ticker />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <Editorial />
      <TrustBar />
      <Reviews />
      <Newsletter />
    </main>
  );
}