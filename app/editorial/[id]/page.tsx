import { notFound } from "next/navigation";
import { getEditorialById } from "@/lib/services/editorial.service";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const editorial = await getEditorialById(id);
  if (!editorial) return {};
  return {
    title: `${editorial.title}${editorial.titleItalic ? " " + editorial.titleItalic : ""}`,
    description: editorial.body.slice(0, 155),
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const editorial = await getEditorialById(id);
  if (!editorial || !editorial.isActive) notFound();

  return (
    <main className="min-h-screen">
      {/* Hero image */}
      <div className="relative w-full h-[50vh] md:h-[65vh] bg-[#1a1a1a] overflow-hidden">
        {editorial.imageUrl ? (
          <Image
            src={editorial.imageUrl}
            alt={editorial.title}
            fill
            className="object-cover object-center opacity-80"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900" />
        )}
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-20 pb-12 md:pb-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9bba8] mb-4 font-light">
            {editorial.eyebrow}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-light leading-[1.1] text-white">
            {editorial.title}
            {editorial.titleItalic && (
              <>
                <br />
                <em>{editorial.titleItalic}</em>
              </>
            )}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-14 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-stone-400 hover:text-stone-700 transition-colors mb-12"
        >
          <ArrowLeft size={12} />
          Back to Home
        </Link>

        <div>
          {editorial.body.split("\n").map((paragraph, i) =>
            paragraph.trim() ? (
              <p
                key={i}
                className="font-serif text-lg md:text-xl font-light text-stone-700 leading-[1.85] mb-6"
              >
                {paragraph}
              </p>
            ) : null
          )}
        </div>

        <div className="mt-12 pt-10 border-t border-stone-100">
          <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-4 font-light">
            Shop the Edit
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-[#2a1f18] text-[#f0ebe3] text-[11px] tracking-[0.2em] uppercase font-normal hover:bg-[#3d2f25] transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </main>
  );
}