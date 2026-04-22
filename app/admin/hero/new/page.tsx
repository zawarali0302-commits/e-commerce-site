import { HeroSlideForm } from "@/components/admin/hero-slide-form";

export default function NewHeroSlidePage() {
  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-light mb-1">
          Hero Section
        </p>
        <h1 className="font-serif text-3xl font-light text-stone-900">New Slide</h1>
      </div>
      <HeroSlideForm />
    </div>
  );
}