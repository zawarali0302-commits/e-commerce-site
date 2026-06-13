"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import prisma from "../prisma";

export async function createHeroSlideAction(formData: FormData) {
  await requireAdmin();

  await prisma.heroSlide.create({
    data: {
      title: formData.get("title") as string,
      titleItalic: (formData.get("titleItalic") as string) || null,
      subtitle: (formData.get("subtitle") as string) || null,
      label: (formData.get("label") as string) || null,
      ctaText: (formData.get("ctaText") as string) || "Explore Collection",
      ctaHref: (formData.get("ctaHref") as string) || "/products",
      imageUrl: (formData.get("imageUrl") as string) || null,
      bgColor: (formData.get("bgColor") as string) || "#f0ebe3",
      position: parseInt(formData.get("position") as string, 10) || 0,
      isActive: formData.get("isActive") === "true",
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/hero");
  redirect("/admin/hero");
}

export async function updateHeroSlideAction(id: string, formData: FormData) {
  await requireAdmin();

  await prisma.heroSlide.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      titleItalic: (formData.get("titleItalic") as string) || null,
      subtitle: (formData.get("subtitle") as string) || null,
      label: (formData.get("label") as string) || null,
      ctaText: (formData.get("ctaText") as string) || "Explore Collection",
      ctaHref: (formData.get("ctaHref") as string) || "/products",
      imageUrl: (formData.get("imageUrl") as string) || null,
      bgColor: (formData.get("bgColor") as string) || "#f0ebe3",
      position: parseInt(formData.get("position") as string, 10) || 0,
      isActive: formData.get("isActive") === "true",
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/hero");
  redirect("/admin/hero");
}

export async function deleteHeroSlideAction(id: string) {
  await requireAdmin();
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function toggleHeroSlideAction(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.heroSlide.update({ where: { id }, data: { isActive } });
  revalidatePath("/");
  revalidatePath("/admin/hero");
}