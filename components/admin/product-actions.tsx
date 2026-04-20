"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Pencil, Trash2, Star } from "lucide-react";
import { SerializedProductWithCategory } from "@/lib/serialize";
import { deleteProductAction, toggleFeaturedAction } from "@/lib/actions/admin.actions";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: SerializedProductWithCategory }) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    startTransition(() => deleteProductAction(product.id));
  };

  const handleToggleFeatured = () => {
    startTransition(() => toggleFeaturedAction(product.id, !product.isFeatured));
  };

  return (
    <div className="flex items-center gap-1.5 justify-end">
      <button
        onClick={handleToggleFeatured}
        disabled={isPending}
        title={product.isFeatured ? "Remove from featured" : "Mark as featured"}
        className={cn(
          "w-7 h-7 flex items-center justify-center transition-colors",
          product.isFeatured
            ? "text-amber-500 hover:text-amber-700"
            : "text-stone-200 hover:text-amber-400"
        )}
      >
        <Star size={13} fill={product.isFeatured ? "currentColor" : "none"} />
      </button>

      <Link
        href={`/admin/products/${product.slug}/edit`}
        className="w-7 h-7 flex items-center justify-center text-stone-300 hover:text-stone-700 transition-colors"
        title="Edit"
      >
        <Pencil size={13} />
      </Link>

      <button
        onClick={handleDelete}
        disabled={isPending}
        title={confirmDelete ? "Click again to confirm" : "Archive product"}
        className={cn(
          "w-7 h-7 flex items-center justify-center transition-colors",
          confirmDelete
            ? "text-red-500 hover:text-red-700"
            : "text-stone-300 hover:text-red-400"
        )}
        onBlur={() => setConfirmDelete(false)}
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}