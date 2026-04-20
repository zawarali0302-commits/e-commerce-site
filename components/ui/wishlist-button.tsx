"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleWishlistAction } from "@/lib/actions/wishlist.actions";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  initialWishlisted?: boolean;
  className?: string;
  size?: number;
}

export function WishlistButton({
  productId,
  initialWishlisted = false,
  className,
  size = 14,
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent Link navigation when inside an <a>
    e.stopPropagation();

    // Optimistic update
    setWishlisted((w) => !w);

    startTransition(async () => {
      const result = await toggleWishlistAction(productId);
      if (!result.success) {
        // Revert on failure
        setWishlisted((w) => !w);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex items-center justify-center transition-colors disabled:opacity-60",
        className
      )}
    >
      <Heart
        size={size}
        className={
          wishlisted ? "fill-red-500 text-red-500" : "text-stone-500"
        }
      />
    </button>
  );
}