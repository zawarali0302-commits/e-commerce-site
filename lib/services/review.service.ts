import prisma from "@/lib/prisma";

export async function getReviewsByProduct(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createReview({
  productId,
  userId,
  rating,
  comment,
}: {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}) {
  return prisma.review.create({
    data: { productId, userId, rating, comment },
  });
}

export async function hasUserReviewedProduct(userId: string, productId: string) {
  const existing = await prisma.review.findFirst({
    where: { userId, productId },
  });
  return !!existing;
}