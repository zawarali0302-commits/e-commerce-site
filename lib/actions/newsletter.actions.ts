"use server";

import { revalidatePath } from "next/cache";
import { BrevoClient } from "@getbrevo/brevo";
import prisma from "../prisma";

export type NewsletterResult =
  | { success: true }
  | { success: false; error: string };

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! });

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

  // Sync to Brevo
  try {
    await brevo.contacts.createContact({
      email: normalizedEmail,
      listIds: [2], // Add your Brevo list ID here
      updateEnabled: true,
    });
  } catch (err: any) {
    console.error("Brevo sync error:", err?.message ?? err);
  }

  revalidatePath("/admin/subscribers");
  return { success: true };
}

export async function deleteSubscriberAction(id: string) {
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/subscribers");
}
