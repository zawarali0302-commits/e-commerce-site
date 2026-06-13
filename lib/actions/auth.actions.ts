"use server";

import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { welcomeEmailTemplate } from "@/lib/email-templates";
import prisma from "../prisma";

export type RegisterResult =
  | { success: true }
  | { success: false; error: string };

export async function registerAction(
  name: string,
  email: string,
  password: string
): Promise<RegisterResult> {
  if (!name || !email || !password) {
    return { success: false, error: "All fields are required." };
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
    },
  });

  // Send welcome email
  await sendEmail({
    to: normalizedEmail,
    subject: "Welcome to Éclat",
    html: welcomeEmailTemplate(name),
  });

  return { success: true };
}