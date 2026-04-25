import prisma from "../prisma";

export interface SerializedAnnouncement {
  id: string;
  text: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function serialize(a: any): SerializedAnnouncement {
  return {
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export async function getActiveAnnouncement(): Promise<SerializedAnnouncement | null> {
  const announcement = await prisma.announcement.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });
  return announcement ? serialize(announcement) : null;
}

export async function getAllAnnouncements(): Promise<SerializedAnnouncement[]> {
  const announcements = await prisma.announcement.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return announcements.map(serialize);
}

export async function getAnnouncementById(id: string) {
  const a = await prisma.announcement.findUnique({ where: { id } });
  return a ? serialize(a) : null;
}