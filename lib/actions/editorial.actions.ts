"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByExternalId } from "@/lib/services/user.service";
import prisma from "../prisma";

async function requireAdmin() {
  const { userId: externalId } = await auth();
  if (!externalId) throw new Error("Unauthorized");
  const user = await getUserByExternalId(externalId);
  if (!user || user.role !== "ADMIN") throw new Error("Forbidden");
}

function extractData(formData: FormData) {
  return {
    eyebrow: formData.get("eyebrow") as string,
    title: formData.get("title") as string,
    titleItalic: (formData.get("titleItalic") as string) || null,
    body: formData.get("body") as string,
    ctaText: (formData.get("ctaText") as string) || "Read the Story",
    ctaHref: (formData.get("ctaHref") as string) || "/products",
    imageUrl: (formData.get("imageUrl") as string) || null,
    isActive: formData.get("isActive") === "true",
  };
}

export async function createEditorialAction(formData: FormData) {
  await requireAdmin();
  await prisma.editorial.create({ data: extractData(formData) });
  revalidatePath("/");
  revalidatePath("/admin/editorial");
  redirect("/admin/editorial");
}

export async function updateEditorialAction(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.editorial.update({ where: { id }, data: extractData(formData) });
  revalidatePath("/");
  revalidatePath("/admin/editorial");
  redirect("/admin/editorial");
}

export async function deleteEditorialAction(id: string) {
  await requireAdmin();
  await prisma.editorial.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/editorial");
}

export async function toggleEditorialAction(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.editorial.update({ where: { id }, data: { isActive } });
  revalidatePath("/");
  revalidatePath("/admin/editorial");
}