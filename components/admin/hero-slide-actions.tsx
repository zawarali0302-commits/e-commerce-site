"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { SerializedHeroSlide } from "@/lib/services/hero.service";
import { deleteHeroSlideAction, toggleHeroSlideAction } from "@/lib/actions/hero.actions";
import { cn } from "@/lib/utils";

export function HeroSlideActions({ slide }: { slide: SerializedHeroSlide }) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleToggle = () => {
    startTransition(() => toggleHeroSlideAction(slide.id, !slide.isActive));
  };

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    startTransition(() => deleteHeroSlideAction(slide.id));
  };

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        onClick={handleToggle}
        disabled={isPending}
        title={slide.isActive ? "Hide slide" : "Show slide"}
        className={cn(
          "w-7 h-7 flex items-center justify-center transition-colors",
          slide.isActive ? "text-green-500 hover:text-green-700" : "text-stone-300 hover:text-stone-600"
        )}
      >
        {slide.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
      </button>

      <Link
        href={`/admin/hero/${slide.id}/edit`}
        className="w-7 h-7 flex items-center justify-center text-stone-300 hover:text-stone-700 transition-colors"
        title="Edit"
      >
        <Pencil size={13} />
      </Link>

      <button
        onClick={handleDelete}
        disabled={isPending}
        title={confirmDelete ? "Click again to confirm" : "Delete slide"}
        className={cn(
          "w-7 h-7 flex items-center justify-center transition-colors",
          confirmDelete ? "text-red-500" : "text-stone-300 hover:text-red-400"
        )}
        onBlur={() => setConfirmDelete(false)}
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}