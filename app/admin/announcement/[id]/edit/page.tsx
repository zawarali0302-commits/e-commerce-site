import { notFound } from "next/navigation";
import { getAnnouncementById } from "@/lib/services/announcement.service";
import { AnnouncementForm } from "@/components/admin/announcement-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAnnouncementPage({ params }: Props) {
  const { id } = await params;
  if (id === "new") notFound();
  const announcement = await getAnnouncementById(id);
  if (!announcement) notFound();

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-light mb-1">Announcement Bar</p>
        <h1 className="font-serif text-3xl font-light text-stone-900">Edit Announcement</h1>
      </div>
      <AnnouncementForm announcement={announcement} />
    </div>
  );
}