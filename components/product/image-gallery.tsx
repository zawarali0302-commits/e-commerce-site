"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export function ImageGallery({ images, name }: ImageGalleryProps) {
  const [active, setActive] = useState(0);

  const allImages = images.length > 0 ? images : ["/placeholder.jpg"];

  const prev = () => setActive((i) => (i === 0 ? allImages.length - 1 : i - 1));
  const next = () => setActive((i) => (i === allImages.length - 1 ? 0 : i + 1));

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      {/* Main image */}
      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden group">
        <Image
          key={active}
          src={allImages[active]}
          alt={`${name} – image ${active + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top"
          priority
        />

        {/* Prev / Next arrows — only show if multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} className="text-stone-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight size={16} className="text-stone-700" />
            </button>

            {/* Dot indicators on mobile */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    i === active ? "bg-stone-800" : "bg-stone-300"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip — hidden on mobile */}
      {allImages.length > 1 && (
        <div className="hidden md:flex gap-2.5 overflow-x-auto pb-1">
          {allImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative shrink-0 w-16 aspect-[3/4] overflow-hidden bg-stone-100 transition-all",
                i === active
                  ? "ring-1 ring-stone-900 ring-offset-1"
                  : "opacity-50 hover:opacity-80"
              )}
            >
              <Image
                src={src}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}