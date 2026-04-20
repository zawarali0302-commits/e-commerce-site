"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

interface SortBarProps {
  sort: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export function SortBar({ sort, totalCount, currentPage, totalPages }: SortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
      <p className="text-[11px] text-stone-400 font-light">
        {totalCount === 0
          ? "No products found"
          : `Page ${currentPage} of ${totalPages}`}
      </p>
      <Select value={sort} onValueChange={handleSort} disabled={isPending}>
        <SelectTrigger className="w-44 h-8 text-xs border-stone-200 font-light rounded-none focus:ring-0 focus:ring-offset-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-none">
          {SORT_OPTIONS.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="text-xs font-light"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}