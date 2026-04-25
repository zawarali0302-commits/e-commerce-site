"use client";

import { useTransition } from "react";
import { SerializedAnnouncement } from "@/lib/services/announcement.service";
import { createAnnouncementAction, updateAnnouncementAction } from "@/lib/actions/announcement.actions";

const inputCls = "w-full border border-stone-200 px-3 py-2.5 text-sm text-stone-900 font-light outline-none focus:border-stone-400 transition-colors bg-white";

export function AnnouncementForm({ announcement }: { announcement?: SerializedAnnouncement }) {
  const [isPending, startTransition] = useTransition();
  const isEdit = !!announcement;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (isEdit) {
        await updateAnnouncementAction(announcement.id, formData);
      } else {
        await createAnnouncementAction(formData);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-6">
      <div>
        <div className="flex items-baseline gap-2 mb-1.5">
          <label className="text-[10px] tracking-[0.15em] uppercase text-stone-600 font-medium">
            Announcement Text <span className="text-red-400">*</span>
          </label>
          <span className="text-[10px] text-stone-300 font-light">Shown in the top bar</span>
        </div>
        <input
          name="text"
          required
          defaultValue={announcement?.text}
          placeholder="New Collection Arriving — Free Shipping on Orders Over PKR 3,000"
          className={inputCls}
        />
      </div>

      <label className="flex items-center justify-between py-3 border border-stone-100 px-4 cursor-pointer hover:border-stone-200 transition-colors">
        <div>
          <p className="text-sm font-normal text-stone-900">Active</p>
          <p className="text-[11px] text-stone-400 font-light">Show this announcement on the site</p>
        </div>
        <input
          type="checkbox"
          name="isActive"
          value="true"
          defaultChecked={announcement?.isActive ?? true}
          className="w-4 h-4 accent-stone-900"
        />
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 bg-[#2a1f18] text-[#f0ebe3] text-[10px] tracking-[0.2em] uppercase font-normal hover:bg-[#3d2f25] transition-colors disabled:opacity-50"
        >
          {isPending ? isEdit ? "Saving..." : "Creating..." : isEdit ? "Save Changes" : "Create Announcement"}
        </button>
        <a href="/admin/announcement" className="px-8 py-3 border border-stone-200 text-[10px] tracking-[0.2em] uppercase text-stone-600 font-normal hover:border-stone-900 transition-colors">
          Cancel
        </a>
      </div>
    </form>
  );
}