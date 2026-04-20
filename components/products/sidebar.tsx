"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { SerializedCategory } from "@/lib/serialize";
import { cn } from "@/lib/utils";

interface SidebarProps {
  categories: SerializedCategory[];
  activeCategory: string | null;
  minPrice: number;
  maxPrice: number;
}

export function Sidebar({
  categories,
  activeCategory,
  minPrice,
  maxPrice,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentMin = Number(searchParams.get("min") ?? minPrice);
  const currentMax = Number(searchParams.get("max") ?? maxPrice);
  const currentInStock = searchParams.get("inStock") === "true";

  const [priceMin, setPriceMin] = useState(currentMin);
  const [priceMax, setPriceMax] = useState(currentMax);

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Always reset to page 1 when filters change
      params.delete("page");
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) params.delete(key);
        else params.set(key, value);
      });
      return params.toString();
    },
    [searchParams]
  );

  const navigate = (updates: Record<string, string | null>) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString(updates)}`);
    });
  };

  const handleCategory = (slug: string | null) => {
    navigate({ category: slug });
  };

  const handleInStock = (checked: boolean) => {
    navigate({ inStock: checked ? "true" : null });
  };

  const applyPrice = () => {
    navigate({
      min: priceMin.toString(),
      max: priceMax.toString(),
    });
  };

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname);
    });
    setPriceMin(minPrice);
    setPriceMax(maxPrice);
  };

  const hasFilters =
    activeCategory ||
    searchParams.has("min") ||
    searchParams.has("max") ||
    searchParams.has("inStock");

  return (
    <div className={cn("transition-opacity", isPending && "opacity-50")}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] tracking-[0.2em] uppercase text-stone-900 font-medium">
          Filter
        </span>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[10px] tracking-[0.12em] uppercase text-stone-400 hover:text-stone-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.18em] uppercase text-stone-500 mb-3 font-medium">
          Category
        </p>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => handleCategory(null)}
            className={cn(
              "text-left text-sm font-light py-1 transition-colors",
              !activeCategory
                ? "text-stone-900 font-normal"
                : "text-stone-400 hover:text-stone-700"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.slug)}
              className={cn(
                "text-left text-sm font-light py-1 transition-colors",
                activeCategory === cat.slug
                  ? "text-stone-900 font-normal"
                  : "text-stone-400 hover:text-stone-700"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-stone-100 mb-8" />

      {/* Price range */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.18em] uppercase text-stone-500 mb-4 font-medium">
          Price (PKR)
        </p>
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <label className="text-[10px] text-stone-400 block mb-1">Min</label>
              <input
                type="number"
                value={priceMin}
                min={minPrice}
                max={priceMax}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                className="w-full border border-stone-200 px-2.5 py-1.5 text-sm text-stone-900 font-light outline-none focus:border-stone-400 transition-colors bg-white"
              />
            </div>
            <span className="text-stone-300 mt-5">–</span>
            <div className="flex-1">
              <label className="text-[10px] text-stone-400 block mb-1">Max</label>
              <input
                type="number"
                value={priceMax}
                min={priceMin}
                max={maxPrice}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full border border-stone-200 px-2.5 py-1.5 text-sm text-stone-900 font-light outline-none focus:border-stone-400 transition-colors bg-white"
              />
            </div>
          </div>
          <button
            onClick={applyPrice}
            className="w-full py-2 border border-stone-900 text-[10px] tracking-[0.18em] uppercase text-stone-900 font-normal hover:bg-stone-900 hover:text-white transition-all duration-150"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-stone-100 mb-8" />

      {/* In stock toggle */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-[0.18em] uppercase text-stone-500 font-medium">
          In Stock Only
        </p>
        <button
          role="switch"
          aria-checked={currentInStock}
          onClick={() => handleInStock(!currentInStock)}
          className={cn(
            "relative w-9 h-5 rounded-full transition-colors duration-200",
            currentInStock ? "bg-[#2a1f18]" : "bg-stone-200"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
              currentInStock && "translate-x-4"
            )}
          />
        </button>
      </div>
    </div>
  );
}