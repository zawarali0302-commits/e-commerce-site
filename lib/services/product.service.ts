import { Prisma } from "@/app/generated/prisma/client";
import { serializeProduct } from "@/lib/serialize";
import prisma from "@/lib/prisma";

const ITEMS_PER_PAGE = 12;

export async function getProducts({
  category,
  sort = "newest",
  min,
  max,
  inStock,
  page = 1,
  search,
}: {
  category?: string;
  sort?: string;
  min?: string;
  max?: string;
  inStock?: string;
  page?: number;
  search?: string;
}) {
  const where: Prisma.ProductWhereInput = {
    isArchived: false,
    ...(category && { category: { slug: category } }),
    ...(inStock === "true" && { stock: { gt: 0 } }),
    ...((min || max) && {
      price: {
        ...(min && { gte: new Prisma.Decimal(min) }),
        ...(max && { lte: new Prisma.Decimal(max) }),
      },
    }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
      ? { price: "desc" }
      : sort === "name-asc"
      ? { name: "asc" }
      : { createdAt: "desc" };

  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [rawProducts, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: ITEMS_PER_PAGE,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: rawProducts.map(serializeProduct),
    totalCount,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product || product.isArchived) return null;

  return {
    ...serializeProduct({ ...product, category: product.category }),
    reviews: product.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      userId: r.userId,
      productId: r.productId,
      user: {
        id: r.user.id,
        name: r.user.name,
        imageUrl: r.user.imageUrl,
      },
    })),
  };
}

export async function getRelatedProducts(categoryId: string, excludeId: string) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      isArchived: false,
      NOT: { id: excludeId },
    },
    include: { category: true },
    take: 4,
  });

  return products.map(serializeProduct);
}

export async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isArchived: false },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return products.map(serializeProduct);
}

export async function getProductPriceRange() {
  const range = await prisma.product.aggregate({
    where: { isArchived: false },
    _min: { price: true },
    _max: { price: true },
  });

  return {
    min: Number(range._min.price ?? 0),
    max: Number(range._max.price ?? 50000),
  };
}

export async function getAllProductSlugs() {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    select: { slug: true },
  });
  return products.map((p) => p.slug);
}

export function getProductRatingStats(reviews: { rating: number }[]) {
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return { totalReviews, avgRating, ratingBreakdown };
}