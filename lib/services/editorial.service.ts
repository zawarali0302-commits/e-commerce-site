import prisma from "../prisma";

export interface SerializedEditorial {
  id: string;
  eyebrow: string;
  title: string;
  titleItalic: string | null;
  body: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function serializeEditorial(e: any): SerializedEditorial {
  return {
    ...e,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  };
}

export async function getActiveEditorial(): Promise<SerializedEditorial | null> {
  const editorial = await prisma.editorial.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });
  return editorial ? serializeEditorial(editorial) : null;
}

export async function getAllEditorials(): Promise<SerializedEditorial[]> {
  const editorials = await prisma.editorial.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return editorials.map(serializeEditorial);
}

export async function getEditorialById(id: string) {
  const editorial = await prisma.editorial.findUnique({ where: { id } });
  if (!editorial) return null;
  return serializeEditorial(editorial);
}