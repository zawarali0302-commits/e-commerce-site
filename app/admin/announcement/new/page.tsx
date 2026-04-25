import { AnnouncementForm } from "@/components/admin/announcement-form";

export default function NewAnnouncementPage() {
  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-light mb-1">Announcement Bar</p>
        <h1 className="font-serif text-3xl font-light text-stone-900">New Announcement</h1>
      </div>
      <AnnouncementForm />
    </div>
  );
}