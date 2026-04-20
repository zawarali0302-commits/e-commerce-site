import { serializeCategory } from "@/lib/serialize";
import prisma from "../prisma";

export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return categories.map(serializeCategory);
}

export async function getCategoriesWithCount() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    take: 3,
  });

  return categories.map((cat) => ({
    ...serializeCategory(cat),
    productCount: cat._count.products,
  }));
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return null;
  return serializeCategory(category);
}