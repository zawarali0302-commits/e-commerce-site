import prisma from "../prisma";

export interface SerializedHeroSlide {
  id: string;
  title: string;
  titleItalic: string | null;
  subtitle: string | null;
  label: string | null;
  ctaText: string;
  ctaHref: string;
  imageUrl: string | null;
  bgColor: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function serializeSlide(slide: any): SerializedHeroSlide {
  return {
    ...slide,
    createdAt: slide.createdAt.toISOString(),
    updatedAt: slide.updatedAt.toISOString(),
  };
}

export async function getActiveHeroSlides(): Promise<SerializedHeroSlide[]> {
  const slides = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { position: "asc" },
  });
  return slides.map(serializeSlide);
}

export async function getAllHeroSlides(): Promise<SerializedHeroSlide[]> {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { position: "asc" },
  });
  return slides.map(serializeSlide);
}

export async function getHeroSlideById(id: string) {
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!slide) return null;
  return serializeSlide(slide);
}