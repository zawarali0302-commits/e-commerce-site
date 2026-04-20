import { Product, Category } from "@/app/generated/prisma/client";

export type SerializedProduct = Omit<Product, "price" | "createdAt" | "updatedAt"> & {
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type SerializedProductWithCategory = SerializedProduct & {
  category: SerializedCategory;
};

export type SerializedCategory = Omit<Category, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export function serializeProduct(
  product: Product & { category: Category }
): SerializedProductWithCategory {
  return {
    ...product,
    price: Number(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: serializeCategory(product.category),
  };
}

export function serializeCategory(category: Category): SerializedCategory {
  return {
    ...category,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}