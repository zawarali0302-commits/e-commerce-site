import { notFound } from "next/navigation";
import { getHeroSlideById } from "@/lib/services/hero.service";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";

interface EditHeroSlidePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHeroSlidePage({ params }: EditHeroSlidePageProps) {
  const { id } = await params;

  // Guard against Next.js routing "new" as a dynamic segment
  if (id === "new") notFound();

  const slide = await getHeroSlideById(id);
  if (!slide) notFound();

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-light mb-1">
          Hero Section
        </p>
        <h1 className="font-serif text-3xl font-light text-stone-900">Edit Slide</h1>
      </div>
      <HeroSlideForm slide={slide} />
    </div>
  );
}