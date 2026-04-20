import Link from "next/link";
import Image from "next/image";

export function Editorial() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
      {/* Image panel */}
      <div className="relative bg-[#1a1a1a] overflow-hidden min-h-[300px] md:min-h-auto">
        {/* 
          <Image
            src="/images/editorial-spring.jpg"
            alt="Spring 2026 Editorial"
            fill
            className="object-cover object-center opacity-75"
          />
        */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 opacity-90" />
      </div>

      {/* Content panel */}
      <div className="bg-[#f0ebe3] px-10 md:px-16 py-16 md:py-20 flex flex-col justify-center">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#6b5d52] mb-5 font-normal">
          The Edit · Spring 2026
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-light leading-[1.1] text-[#2a1f18] mb-4">
          Dressed in
          <br />
          <em>Morning Light</em>
        </h2>
        <p className="text-sm leading-[1.85] text-[#6b5d52] mb-8 font-light max-w-sm">
          This season, we turn to the quieter hours — the soft warmth of early
          sun, the unhurried ritual of getting dressed with intention. Curated
          pieces for women who move through the world with grace.
        </p>
        <Link
          href="/editorial/spring-2026"
          className="self-start px-8 py-3 border border-[#2a1f18] text-[11px] tracking-[0.2em] uppercase text-[#2a1f18] font-normal hover:bg-[#2a1f18] hover:text-[#f0ebe3] transition-all duration-200"
        >
          Read the Story
        </Link>
      </div>
    </section>
  );
}