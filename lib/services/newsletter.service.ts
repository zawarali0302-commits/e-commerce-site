import prisma from "../prisma";

export async function getAllSubscribers() {
  return prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getSubscriberCount() {
  return prisma.newsletterSubscriber.count();
}

export async function deleteSubscriber(id: string) {
  return prisma.newsletterSubscriber.delete({ where: { id } });
}