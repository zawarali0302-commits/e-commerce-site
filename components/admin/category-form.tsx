"use client";

import { useTransition, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/lib/actions/admin.actions";
import { SerializedCategory } from "@/lib/serialize";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full border border-stone-200 px-3 py-2.5 text-sm text-stone-900 font-light outline-none focus:border-stone-400 transition-colors bg-white";

// ─── Category Form (create) ───────────────────────────────────────────────────

export function CategoryForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createCategoryAction(formData);
      (e.target as HTMLFormElement).reset();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-[10px] tracking-[0.15em] uppercase text-stone-600 font-medium block mb-1.5">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          name="name"
          required
          placeholder="e.g. Ready to Wear"
          className={inputCls}
        />
        <p className="text-[10px] text-stone-300 font-light mt-1">
          Slug is auto-generated from name
        </p>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-[#2a1f18] text-[#f0ebe3] text-[10px] tracking-[0.18em] uppercase font-normal hover:bg-[#3d2f25] transition-colors disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
}

// ─── Category Actions (per row) ───────────────────────────────────────────────

export function CategoryActions({
  category,
}: {
  category: SerializedCategory & { productCount: number };
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    startTransition(async () => {
      await updateCategoryAction(category.id, formData);
      setEditing(false);
    });
  };

  const handleDelete = () => {
    if (category.productCount > 0) {
      alert(
        `Cannot delete "${category.name}" — it has ${category.productCount} products. Archive or reassign them first.`
      );
      return;
    }
    if (!confirmDelete) { setConfirmDelete(true); return; }
    startTransition(() => deleteCategoryAction(category.id));
  };

  if (editing) {
    return (
      <form onSubmit={handleUpdate} className="col-span-3 flex gap-2 py-1">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-stone-200 px-2 py-1 text-sm font-light outline-none focus:border-stone-400"
          autoFocus
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-3 py-1 bg-[#2a1f18] text-[#f0ebe3] text-[9px] uppercase tracking-[0.1em] disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="px-3 py-1 border border-stone-200 text-[9px] uppercase tracking-[0.1em] text-stone-500"
        >
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-1.5 justify-end">
      <button
        onClick={() => setEditing(true)}
        className="w-7 h-7 flex items-center justify-center text-stone-300 hover:text-stone-700 transition-colors"
        title="Edit"
      >
        <Pencil size={13} />
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        title={confirmDelete ? "Click again to confirm" : "Delete category"}
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