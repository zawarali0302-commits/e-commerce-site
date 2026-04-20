"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByExternalId } from "@/lib/services/user.service";
import prisma from "@/lib/prisma";

// ─── Auth guard ───────────────────────────────────────────────────────────────

async function requireAdmin() {
  const { userId: externalId } = await auth();
  if (!externalId) throw new Error("Unauthorized");
  const user = await getUserByExternalId(externalId);
  if (!user || user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function createProductAction(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const stock = parseInt(formData.get("stock") as string, 10);
  const categoryId = formData.get("categoryId") as string;
  const isFeatured = formData.get("isFeatured") === "true";
  const imagesRaw = formData.get("images") as string;
  const images = imagesRaw
    ? imagesRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  await prisma.product.create({
    data: { name, slug, description, price, stock, categoryId, isFeatured, images },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const stock = parseInt(formData.get("stock") as string, 10);
  const categoryId = formData.get("categoryId") as string;
  const isFeatured = formData.get("isFeatured") === "true";
  const isArchived = formData.get("isArchived") === "true";
  const imagesRaw = formData.get("images") as string;
  const images = imagesRaw
    ? imagesRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  await prisma.product.update({
    where: { id },
    data: { name, description, price, stock, categoryId, isFeatured, isArchived, images },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await prisma.product.update({
    where: { id },
    data: { isArchived: true },
  });
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function toggleFeaturedAction(id: string, isFeatured: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { isFeatured } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  await prisma.category.create({ data: { name, slug } });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  await prisma.category.update({ where: { id }, data: { name, slug } });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function toggleOrderPaidAction(id: string, isPaid: boolean) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { isPaid } });
  revalidatePath("/admin/orders");
}