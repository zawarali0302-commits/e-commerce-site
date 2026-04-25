import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllAnnouncements } from "@/lib/services/announcement.service";
import { AnnouncementActions } from "@/components/admin/announcement-actions";

export default async function AdminAnnouncementPage() {
  const announcements = await getAllAnnouncements();

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light text-stone-900">Announcement Bar</h1>
          <p className="text-sm text-stone-400 font-light mt-1">
            The most recent active announcement shows at the top of the site
          </p>
        </div>
        <Link
          href="/admin/announcement/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2a1f18] text-[#f0ebe3] text-[10px] tracking-[0.18em] uppercase font-normal hover:bg-[#3d2f25] transition-colors"
        >
          <Plus size={13} />
          Add Announcement
        </Link>
      </div>

      {announcements.length === 0 ? (
        <div className="border border-stone-100 py-20 text-center">
          <p className="text-sm text-stone-300 font-light mb-4">No announcements yet</p>
          <Link
            href="/admin/announcement/new"
            className="text-[10px] tracking-[0.15em] uppercase text-stone-400 border-b border-stone-200 pb-0.5 hover:text-stone-700 transition-colors"
          >
            Create your first announcement
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="border border-stone-100 px-5 py-4 flex items-center gap-4 hover:border-stone-200 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-normal text-stone-900 truncate">{a.text}</p>
                  <span className={`shrink-0 text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 ${
                    a.isActive
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : "bg-stone-100 text-stone-400 border border-stone-200"
                  }`}>
                    {a.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
              </div>
              <AnnouncementActions announcement={a} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}