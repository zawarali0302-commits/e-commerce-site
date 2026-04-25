"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { SerializedEditorial } from "@/lib/services/editorial.service";
import { deleteEditorialAction, toggleEditorialAction } from "@/lib/actions/editorial.actions";
import { cn } from "@/lib/utils";

export function EditorialActions({ editorial }: { editorial: SerializedEditorial }) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        onClick={() => startTransition(() => toggleEditorialAction(editorial.id, !editorial.isActive))}
        disabled={isPending}
        title={editorial.isActive ? "Hide" : "Show"}
        className={cn(
          "w-7 h-7 flex items-center justify-center transition-colors",
          editorial.isActive ? "text-green-500 hover:text-green-700" : "text-stone-300 hover:text-stone-600"
        )}
      >
        {editorial.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
      </button>

      <Link
        href={`/admin/editorial/${editorial.id}/edit`}
        className="w-7 h-7 flex items-center justify-center text-stone-300 hover:text-stone-700 transition-colors"
      >
        <Pencil size={13} />
      </Link>

      <button
        onClick={() => {
          if (!confirmDelete) { setConfirmDelete(true); return; }
          startTransition(() => deleteEditorialAction(editorial.id));
        }}
        disabled={isPending}
        title={confirmDelete ? "Click again to confirm" : "Delete"}
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