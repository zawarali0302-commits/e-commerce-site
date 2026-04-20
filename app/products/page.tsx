import { Metadata } from "next";
import { Sidebar } from "@/components/products/sidebar";
import { SortBar } from "@/components/products/sort-bar";
import { ProductGrid } from "@/components/products/product-grid";
import { MobileFilterDrawer } from "@/components/products/mobile-filter-drawer";
import { ActiveFilters } from "@/components/products/active-filters";
import { getProducts, getProductPriceRange } from "@/lib/services/product.service";
import { getAllCategories } from "@/lib/services/category.service";

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const { category, search } = await searchParams;
  const title = search
    ? `Search: ${search}`
    : category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "All Products";
  return { title };
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    min?: string;
    max?: string;
    inStock?: string;
    page?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, sort = "newest", min, max, inStock, page = "1", search } =
    await searchParams;

  const currentPage = Math.max(1, parseInt(page, 10));

  const [{ products, totalCount, totalPages }, categories, priceRange] =
    await Promise.all([
      getProducts({ category, sort, min, max, inStock, page: currentPage, search }),
      getAllCategories(),
      getProductPriceRange(),
    ]);

  const pageTitle = search
    ? `Results for "${search}"`
    : categories.find((c) => c.slug === category)?.name ?? "All Products";

  return (
    <main className="min-h-screen">
      <div className="border-b border-stone-100 px-6 md:px-10 py-10">
        <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-2 font-light">
          {category ? "Collections" : "Shop"}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-light">{pageTitle}</h1>
        <p className="text-sm text-stone-400 mt-2 font-light">
          {totalCount} {totalCount === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="flex px-6 md:px-10 py-8 gap-10 items-start">
        <aside className="hidden md:block w-52 shrink-0 sticky top-24">
          <Sidebar
            categories={categories}
            activeCategory={category ?? null}
            minPrice={priceRange.min}
            maxPrice={priceRange.max}
          />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 md:hidden">
            <MobileFilterDrawer
              categories={categories}
              activeCategory={category ?? null}
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
            />
            <SortBar
              sort={sort}
              totalCount={totalCount}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>

          <div className="hidden md:block">
            <SortBar
              sort={sort}
              totalCount={totalCount}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>

          <ActiveFilters
            categories={categories}
            activeCategory={category ?? null}
            min={min}
            max={max}
            inStock={inStock}
          />

          <ProductGrid
            products={products}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </main>
  );
}