"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { X } from "lucide-react";
import { SerializedCategory } from "@/lib/serialize";
import { formatPrice } from "@/lib/utils";

interface ActiveFiltersProps {
  categories: SerializedCategory[];
  activeCategory: string | null;
  min?: string;
  max?: string;
  inStock?: string;
}

export function ActiveFilters({
  categories,
  activeCategory,
  min,
  max,
  inStock,
}: ActiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const remove = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const chips: { label: string; key: string }[] = [];

  if (activeCategory) {
    const cat = categories.find((c) => c.slug === activeCategory);
    if (cat) chips.push({ label: cat.name, key: "category" });
  }

  if (min || max) {
    const label = `${min ? formatPrice(Number(min)) : "Any"} – ${
      max ? formatPrice(Number(max)) : "Any"
    }`;
    chips.push({ label, key: "min" }); // removing min removes max together
  }

  if (inStock === "true") chips.push({ label: "In Stock", key: "inStock" });

  if (chips.length === 0) return null;

  const handleRemove = (key: string) => {
    // Price uses both min & max keys, remove both
    if (key === "min") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("min");
      params.delete("max");
      params.delete("page");
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    } else {
      remove(key);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => handleRemove(chip.key)}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-[11px] text-stone-600 font-light transition-colors rounded-none disabled:opacity-50"
        >
          {chip.label}
          <X size={10} className="text-stone-400" />
        </button>
      ))}
    </div>
  );
}