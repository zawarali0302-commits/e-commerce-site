import { currentUser } from "@clerk/nextjs/server";
import prisma from "../prisma";

export async function upsertUser({
  externalId,
  email,
  name,
  imageUrl,
}: {
  externalId: string;
  email: string;
  name?: string | null;
  imageUrl?: string | null;
}) {
  return prisma.user.upsert({
    where: { externalId },
    create: { externalId, email, name, imageUrl },
    update: { email, name, imageUrl },
  });
}

export async function deleteUserByExternalId(externalId: string) {
  return prisma.user.delete({ where: { externalId } });
}

export async function getUserByExternalId(externalId: string) {
  // Try to find the user first
  const existing = await prisma.user.findUnique({ where: { externalId } });
  if (existing) return existing;

  // Not found — fetch from Clerk and auto-create (handles missing webhook in dev)
  try {
    const clerkUser = await currentUser();
    if (!clerkUser || clerkUser.id !== externalId) return null;

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    const name = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ") || null;

    return prisma.user.create({
      data: {
        externalId,
        email,
        name,
        imageUrl: clerkUser.imageUrl ?? null,
      },
    });
  } catch {
    return null;
  }
}