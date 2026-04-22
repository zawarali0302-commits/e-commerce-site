import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllHeroSlides } from "@/lib/services/hero.service";
import { HeroSlideActions } from "@/components/admin/hero-slide-actions";

export default async function AdminHeroPage() {
  const slides = await getAllHeroSlides();

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light text-stone-900">Hero Section</h1>
          <p className="text-sm text-stone-400 font-light mt-1">
            {slides.length} slide{slides.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/hero/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2a1f18] text-[#f0ebe3] text-[10px] tracking-[0.18em] uppercase font-normal hover:bg-[#3d2f25] transition-colors"
        >
          <Plus size={13} />
          Add Slide
        </Link>
      </div>

      {slides.length === 0 ? (
        <div className="border border-stone-100 py-20 text-center">
          <p className="text-sm text-stone-300 font-light mb-4">No slides yet</p>
          <Link
            href="/admin/hero/new"
            className="text-[10px] tracking-[0.15em] uppercase text-stone-400 border-b border-stone-200 pb-0.5 hover:text-stone-700 transition-colors"
          >
            Create your first slide
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="border border-stone-100 p-5 flex items-center gap-5 hover:border-stone-200 transition-colors"
            >
              {/* Color preview */}
              <div
                className="w-12 h-16 shrink-0 border border-stone-100"
                style={{ backgroundColor: slide.bgColor }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-normal text-stone-900">
                    {slide.title}
                    {slide.titleItalic && (
                      <em className="font-serif"> {slide.titleItalic}</em>
                    )}
                  </p>
                  <span
                    className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 ${
                      slide.isActive
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-stone-100 text-stone-400 border border-stone-200"
                    }`}
                  >
                    {slide.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                {slide.label && (
                  <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 font-light">
                    {slide.label}
                  </p>
                )}
                <p className="text-xs text-stone-400 font-light mt-1">
                  Position {slide.position} · {slide.ctaText} → {slide.ctaHref}
                </p>
              </div>

              {/* Actions */}
              <HeroSlideActions slide={slide} />
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-stone-300 font-light mt-6">
        The first active slide becomes the main hero panel. Slides 2 and 3 fill the right column.
      </p>
    </div>
  );
}