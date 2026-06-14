import { getActiveAnnouncement } from "@/lib/services/announcement.service";

export async function Announcement() {
  const announcement = await getActiveAnnouncement();

  const text = announcement?.text ??
    "New Collection Arriving — Free Shipping on Orders Over PKR 3,000";

  return (
    <div className="bg-[#1a1a1a] text-[#e8ddd0] text-center py-2 md:py-2.5 text-[9px] md:text-[11px] tracking-[0.08em] md:tracking-[0.12em] uppercase font-light px-4 leading-snug">
      {text}
    </div>
  );
}