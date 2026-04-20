"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { SerializedCategory } from "@/lib/serialize";

interface MobileFilterDrawerProps {
  categories: SerializedCategory[];
  activeCategory: string | null;
  minPrice: number;
  maxPrice: number;
}

export function MobileFilterDrawer(props: MobileFilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 md:hidden border border-stone-200 px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-normal text-stone-600 hover:border-stone-900 transition-colors">
          <SlidersHorizontal size={12} />
          Filter
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-white rounded-none">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-[10px] tracking-[0.2em] uppercase font-medium text-left">
            Filter Products
          </SheetTitle>
        </SheetHeader>
        <Sidebar {...props} />
      </SheetContent>
    </Sheet>
  );
}