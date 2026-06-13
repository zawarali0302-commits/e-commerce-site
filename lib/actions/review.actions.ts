"use server";

import { revalidatePath } from "next/cache";
import { createReview, hasUserReviewedProduct } from "@/lib/services/review.service";
import { auth } from "@/lib/auth";

export type ReviewActionState = {
  success: boolean;
  error?: string;
};

export async function submitReviewAction(
  productId: string,
  rating: number,
  comment: string
): Promise<ReviewActionState> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in to leave a review." };
  }

  // 2. Validate inputs
  if (!rating || rating < 1 || rating > 5) {
    return { success: false, error: "Please select a rating between 1 and 5." };
  }
  if (!comment || comment.trim().length < 10) {
    return { success: false, error: "Review must be at least 10 characters." };
  }

  // 3. Check for duplicate review
  const alreadyReviewed = await hasUserReviewedProduct(session.user.id, productId);
  if (alreadyReviewed) {
    return { success: false, error: "You have already reviewed this product." };
  }

  // 5. Create review
  try {
    await createReview({
      productId,
      userId: session.user.id,
      rating,
      comment: comment.trim(),
    });

    // Revalidate product page so new review shows immediately
    revalidatePath(`/product/[slug]`, "page");

    return { success: true };
  } catch (err) {
    console.error("submitReviewAction error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}