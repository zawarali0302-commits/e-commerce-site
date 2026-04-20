import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh] md:min-h-[580px]">
      {/* Main hero panel */}
      <div className="relative bg-[#f0ebe3] flex flex-col justify-end p-10 md:p-14 min-h-[420px] overflow-hidden">
        {/* Replace with your actual hero image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8ddd0] to-[#c9bba8]" />
        {/* 
          Uncomment when you have images:
          <Image
            src="/images/hero-main.jpg"
            alt="Spring Summer 2026 Collection"
            fill
            className="object-cover object-center"
            priority
          />
        */}
        <div className="relative z-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#6b5d52] mb-3 font-normal">
            Spring / Summer 2026
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light leading-[1.1] text-[#2a1f18] mb-6">
            Where <em>Silence</em>
            <br />
            Meets Style
          </h1>
          <Link
            href="/products"
            className="inline-block px-8 py-3 border border-[#2a1f18] text-[11px] tracking-[0.2em] uppercase text-[#2a1f18] font-normal hover:bg-[#2a1f18] hover:text-[#f0ebe3] transition-all duration-200"
          >
            Explore Collection
          </Link>
        </div>
      </div>

      {/* Two stacked sub-panels */}
      <div className="grid grid-rows-2">
        <div className="relative bg-[#2a1f18] flex flex-col justify-end p-8 md:p-10 overflow-hidden min-h-[180px]">
          {/* 
            <Image
              src="/images/hero-eid.jpg"
              alt="Eid Edit 2026"
              fill
              className="object-cover object-center opacity-60"
            />
          */}
          <div className="relative z-10">
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#c9bba8] mb-1.5 font-normal">
              Ready to Wear
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-[#f0ebe3] leading-[1.2]">
              <em>Eid Edit</em>
              <br />
              Now Live
            </h2>
          </div>
        </div>
        <div className="relative bg-[#e8ddd0] flex flex-col justify-end p-8 md:p-10 overflow-hidden min-h-[180px]">
          {/* 
            <Image
              src="/images/hero-summer.jpg"
              alt="Summer Florals"
              fill
              className="object-cover object-center opacity-80"
            />
          */}
          <div className="relative z-10">
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#6b5d52] mb-1.5 font-normal">
              Unstitched
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-[#2a1f18] leading-[1.2]">
              Summer
              <br />
              <em>Florals</em>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}