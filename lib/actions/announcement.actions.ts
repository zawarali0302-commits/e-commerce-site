"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import prisma from "../prisma";

export async function createAnnouncementAction(formData: FormData) {
  await requireAdmin();
  await prisma.announcement.create({
    data: {
      text: formData.get("text") as string,
      isActive: formData.get("isActive") === "true",
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/announcement");
  redirect("/admin/announcement");
}

export async function updateAnnouncementAction(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.announcement.update({
    where: { id },
    data: {
      text: formData.get("text") as string,
      isActive: formData.get("isActive") === "true",
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/announcement");
  redirect("/admin/announcement");
}

export async function deleteAnnouncementAction(id: string) {
  await requireAdmin();
  await prisma.announcement.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/announcement");
}

export async function toggleAnnouncementAction(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.announcement.update({ where: { id }, data: { isActive } });
  revalidatePath("/");
  revalidatePath("/admin/announcement");
}