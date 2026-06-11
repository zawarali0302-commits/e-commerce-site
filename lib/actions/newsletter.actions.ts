"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { sendEmail } from "../email";
import { welcomeEmailTemplate } from "../email-templates";

export type NewsletterResult =
  | { success: true }
  | { success: false; error: string };

export async function subscribeToNewsletterAction(
  email: string
): Promise<NewsletterResult> {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return { success: false, error: "You're already subscribed!" };
  }

  await prisma.newsletterSubscriber.create({
    data: { email: normalizedEmail },
  });

  await sendEmail({
    to: normalizedEmail,
    subject: "Welcome to Éclat",
    html: welcomeEmailTemplate(null),
  });

  revalidatePath("/admin/subscribers");
  return { success: true };
}

export async function deleteSubscriberAction(id: string) {
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/subscribers");
}