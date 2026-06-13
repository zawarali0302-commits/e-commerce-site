"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { toggleWishlistItem } from "@/lib/services/wishlist.service";

export async function toggleWishlistAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Sign in to save items" };

  const result = await toggleWishlistItem(session.user.id, productId);
  revalidatePath("/account");
  return { success: true, wishlisted: result.wishlisted };
}