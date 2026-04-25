import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllEditorials } from "@/lib/services/editorial.service";
import { EditorialActions } from "@/components/admin/editorial-actions";

export default async function AdminEditorialPage() {
  const editorials = await getAllEditorials();

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light text-stone-900">Editorial</h1>
          <p className="text-sm text-stone-400 font-light mt-1">
            {editorials.length} {editorials.length === 1 ? "entry" : "entries"} — the most recent active one shows on the homepage
          </p>
        </div>
        <Link
          href="/admin/editorial/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2a1f18] text-[#f0ebe3] text-[10px] tracking-[0.18em] uppercase font-normal hover:bg-[#3d2f25] transition-colors"
        >
          <Plus size={13} />
          Add Editorial
        </Link>
      </div>

      {editorials.length === 0 ? (
        <div className="border border-stone-100 py-20 text-center">
          <p className="text-sm text-stone-300 font-light mb-4">No editorials yet</p>
          <Link
            href="/admin/editorial/new"
            className="text-[10px] tracking-[0.15em] uppercase text-stone-400 border-b border-stone-200 pb-0.5 hover:text-stone-700 transition-colors"
          >
            Create your first editorial
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {editorials.map((editorial) => (
            <div
              key={editorial.id}
              className="border border-stone-100 p-5 flex items-start gap-5 hover:border-stone-200 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-normal text-stone-900">
                    {editorial.title}
                    {editorial.titleItalic && (
                      <em className="font-serif"> {editorial.titleItalic}</em>
                    )}
                  </p>
                  <span
                    className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 ${
                      editorial.isActive
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-stone-100 text-stone-400 border border-stone-200"
                    }`}
                  >
                    {editorial.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 font-light mb-1">
                  {editorial.eyebrow}
                </p>
                <p className="text-xs text-stone-400 font-light line-clamp-1">
                  {editorial.body}
                </p>
              </div>
              <EditorialActions editorial={editorial} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}