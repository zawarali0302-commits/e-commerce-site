import { serializeProduct } from "@/lib/serialize";
import prisma from "@/lib/prisma";

export async function getWishlistByUserId(userId: string) {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      products: { include: { category: true } },
    },
  });

  if (!wishlist) return { id: null, products: [] };

  return {
    id: wishlist.id,
    products: wishlist.products.map(serializeProduct),
  };
}

export async function toggleWishlistItem(userId: string, productId: string) {
  let wishlist = await prisma.wishlist.findUnique({ where: { userId } });

  // Create wishlist if it doesn't exist
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({ data: { userId } });
  }

  const existing = await prisma.wishlist.findFirst({
    where: { id: wishlist.id, products: { some: { id: productId } } },
  });

  if (existing) {
    await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: { products: { disconnect: { id: productId } } },
    });
    return { wishlisted: false };
  } else {
    await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: { products: { connect: { id: productId } } },
    });
    return { wishlisted: true };
  }
}