"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getUserByExternalId } from "@/lib/services/user.service";
import { toggleWishlistItem } from "@/lib/services/wishlist.service";

export async function toggleWishlistAction(productId: string) {
  const { userId: externalId } = await auth();
  if (!externalId) return { success: false, error: "Sign in to save items" };

  const user = await getUserByExternalId(externalId);
  if (!user) return { success: false, error: "User not found" };

  const result = await toggleWishlistItem(user.id, productId);
  revalidatePath("/account");
  return { success: true, wishlisted: result.wishlisted };
}