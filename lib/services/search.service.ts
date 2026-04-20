import { serializeProduct } from "@/lib/serialize";
import prisma from "@/lib/prisma";

export async function searchProducts(query: string) {
  if (!query || query.trim().length < 2) return [];

  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { category: true },
    take: 6,
    orderBy: { isFeatured: "desc" },
  });

  return products.map(serializeProduct);
}