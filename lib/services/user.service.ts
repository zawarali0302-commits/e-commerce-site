import prisma from "@/lib/prisma";

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
  return prisma.user.findUnique({ where: { externalId } });
}