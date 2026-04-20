"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { toggleWishlistAction } from "@/lib/actions/wishlist.actions";

export function WishlistRemoveButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(async () => {await toggleWishlistAction(productId)})}
      disabled={isPending}
      aria-label="Remove from wishlist"
      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 shadow-sm"
    >
      <X size={12} className="text-stone-600" />
    </button>
  );
}