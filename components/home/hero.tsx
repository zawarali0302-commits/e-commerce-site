import Link from "next/link";
import Image from "next/image";
import { getActiveHeroSlides } from "@/lib/services/hero.service";

export async function Hero() {
  const slides = await getActiveHeroSlides();

  const fallback = {
    id: "fallback",
    title: "Where",
    titleItalic: "Silence",
    subtitle: "Meets Style",
    label: "Spring / Summer 2026",
    ctaText: "Explore Collection",
    ctaHref: "/products",
    imageUrl: null,
    bgColor: "#f0ebe3",
  };

  const mainSlide = slides[0] ?? fallback;
  const subSlides = slides.slice(1, 3);

  const fallbackSubs = [
    { id: "fb1", title: "Eid Edit", titleItalic: "Now Live", label: "Ready to Wear", bgColor: "#2a1f18", ctaHref: "/products", imageUrl: null },
    { id: "fb2", title: "Summer", titleItalic: "Florals", label: "Unstitched", bgColor: "#e8ddd0", ctaHref: "/products", imageUrl: null },
  ];

  const displaySubs = subSlides.length > 0 ? subSlides : fallbackSubs;

  const isDark = (color: string) =>
    parseInt(color.replace("#", ""), 16) < 0x888888 * 3;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh] md:min-h-[580px]">
      {/* Main panel */}
      <Link
        href={mainSlide.ctaHref}
        className="relative flex flex-col justify-end p-10 md:p-14 min-h-[420px] overflow-hidden group"
        style={{ backgroundColor: mainSlide.bgColor }}
      >
        {mainSlide.imageUrl && (
          <Image
            src={mainSlide.imageUrl}
            alt={mainSlide.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            priority
          />
        )}
        <div className="relative z-10">
          {mainSlide.label && (
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#6b5d52] mb-3 font-normal">
              {mainSlide.label}
            </p>
          )}
          <h1 className="font-serif text-5xl md:text-6xl font-light leading-[1.1] text-[#2a1f18] mb-6">
            {mainSlide.title}
            {mainSlide.titleItalic && <> <em>{mainSlide.titleItalic}</em></>}
            {mainSlide.subtitle && <><br />{mainSlide.subtitle}</>}
          </h1>
          <span className="inline-block px-8 py-3 border border-[#2a1f18] text-[11px] tracking-[0.2em] uppercase text-[#2a1f18] font-normal hover:bg-[#2a1f18] hover:text-[#f0ebe3] transition-all duration-200">
            {mainSlide.ctaText}
          </span>
        </div>
      </Link>

      {/* Sub panels */}
      <div className="grid grid-rows-2">
        {displaySubs.map((sub) => {
          const dark = isDark(sub.bgColor);
          return (
            <Link
              key={sub.id}
              href={"ctaHref" in sub ? sub.ctaHref ?? "/products" : "/products"}
              className="relative flex flex-col justify-end p-8 md:p-10 min-h-[180px] overflow-hidden group"
              style={{ backgroundColor: sub.bgColor }}
            >
              {sub.imageUrl && (
                <Image
                  src={sub.imageUrl}
                  alt={sub.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-75"
                />
              )}
              <div className="relative z-10">
                {"label" in sub && sub.label && (
                  <p
                    className="text-[9px] tracking-[0.25em] uppercase mb-1.5 font-normal"
                    style={{ color: dark ? "#c9bba8" : "#6b5d52" }}
                  >
                    {sub.label}
                  </p>
                )}
                <h2
                  className="font-serif text-2xl md:text-3xl font-light leading-[1.2]"
                  style={{ color: dark ? "#f0ebe3" : "#2a1f18" }}
                >
                  {sub.title}
                  {sub.titleItalic && <><br /><em>{sub.titleItalic}</em></>}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}