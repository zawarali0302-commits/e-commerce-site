import Link from "next/link";
import Image from "next/image";
import { SerializedCategory } from "@/lib/serialize";

type CategoryWithCount = SerializedCategory & {
  productCount: number;
};

interface CategoryGridProps {
  categories: CategoryWithCount[];
}

const FALLBACK_BG = ["bg-[#2a1f18]", "bg-[#e0d8ce]", "bg-[#dde5e0]"];

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="px-6 md:px-10 py-14 md:py-20">
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-serif text-4xl md:text-5xl font-light leading-[1.1]">
          Shop by <em>Category</em>
        </h2>
        <Link
          href="/products"
          className="text-[10px] tracking-[0.2em] uppercase text-stone-400 border-b border-stone-300 pb-0.5 hover:text-stone-900 hover:border-stone-900 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`group block ${i === 0 ? "row-span-1 md:row-span-1" : ""}`}
          >
            <div
              className={`relative overflow-hidden ${
                i === 0 ? "aspect-[3/5]" : "aspect-[3/4]"
              } ${FALLBACK_BG[i] ?? "bg-stone-200"}`}
            >
              {/* Uncomment when images are available:
              <Image
                src={`/images/category-${cat.slug}.jpg`}
                alt={cat.name}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
            <div className="pt-3.5 pb-1 flex items-baseline justify-between">
              <span className="font-serif text-xl font-normal">{cat.name}</span>
              <span className="text-[10px] tracking-[0.12em] text-stone-400">
                {cat.productCount} items
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}