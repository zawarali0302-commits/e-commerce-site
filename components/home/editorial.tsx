import Link from "next/link";
import Image from "next/image";
import { getActiveEditorial } from "@/lib/services/editorial.service";

export async function Editorial() {
  const editorial = await getActiveEditorial();

  // Fallback if no editorial in DB yet
  const content = editorial ?? {
    eyebrow: "The Edit · Spring 2026",
    title: "Dressed in",
    titleItalic: "Morning Light",
    body: "This season, we turn to the quieter hours — the soft warmth of early sun, the unhurried ritual of getting dressed with intention. Curated pieces for women who move through the world with grace.",
    ctaText: "Read the Story",
    ctaHref: "/products",
    imageUrl: null,
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
      {/* Image panel */}
      <div className="relative bg-[#1a1a1a] overflow-hidden min-h-[300px] md:min-h-auto">
        {content.imageUrl ? (
          <Image
            src={content.imageUrl}
            alt={`${content.title} ${content.titleItalic ?? ""}`}
            fill
            className="object-cover object-center opacity-75"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 opacity-90" />
        )}
      </div>

      {/* Content panel */}
      <div className="bg-[#f0ebe3] px-10 md:px-16 py-16 md:py-20 flex flex-col justify-center">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#6b5d52] mb-5 font-normal">
          {content.eyebrow}
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-light leading-[1.1] text-[#2a1f18] mb-4">
          {content.title}
          {content.titleItalic && (
            <>
              <br />
              <em>{content.titleItalic}</em>
            </>
          )}
        </h2>
        <p className="text-sm leading-[1.85] text-[#6b5d52] mb-8 font-light max-w-sm">
          {content.body}
        </p>
        <Link
          href={content.ctaHref}
          className="self-start px-8 py-3 border border-[#2a1f18] text-[11px] tracking-[0.2em] uppercase text-[#2a1f18] font-normal hover:bg-[#2a1f18] hover:text-[#f0ebe3] transition-all duration-200"
        >
          {content.ctaText}
        </Link>
      </div>
    </section>
  );
}