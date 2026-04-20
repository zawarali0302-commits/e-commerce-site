"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: string; name: string | null; imageUrl: string | null };
}

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  avgRating: number;
  totalReviews: number;
  ratingBreakdown: { star: number; count: number }[];
}

function Stars({ rating, interactive = false, onRate }: {
  rating: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={interactive ? 20 : 13}
          height={interactive ? 20 : 13}
          viewBox="0 0 12 12"
          fill={(interactive ? hovered || rating : rating) >= star ? "#2a1f18" : "none"}
          stroke="#2a1f18"
          strokeWidth="1"
          className={interactive ? "cursor-pointer" : ""}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate?.(star)}
        >
          <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
        </svg>
      ))}
    </div>
  );
}

function ReviewForm({ productId, onSubmitted }: {
  productId: string;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating."); return; }
    if (comment.trim().length < 10) { setError("Comment must be at least 10 characters."); return; }

    setLoading(true);
    setError("");
    const { submitReviewAction } = await import("@/lib/actions/review.actions");
    const result = await submitReviewAction(productId, rating, comment);
    setLoading(false);
    if (result.success) {
      onSubmitted();
    } else {
      setError(result.error ?? "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-stone-500 mb-2 font-medium">
          Your Rating
        </p>
        <Stars rating={rating} interactive onRate={setRating} />
      </div>
      <div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-stone-500 mb-2 font-medium">
          Your Review
        </p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience with this product..."
          className="w-full border border-stone-200 px-4 py-3 text-sm text-stone-900 font-light placeholder:text-stone-300 outline-none focus:border-stone-400 transition-colors resize-none"
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 font-light">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="self-start px-8 py-3 bg-[#2a1f18] text-[#f0ebe3] text-[10px] tracking-[0.2em] uppercase font-normal hover:bg-[#3d2f25] transition-colors disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export function ReviewSection({
  productId,
  reviews,
  avgRating,
  totalReviews,
  ratingBreakdown,
}: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="reviews" className="px-6 md:px-10 py-14 md:py-20">
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-serif text-3xl md:text-4xl font-light">
          Reviews
        </h2>
        {!submitted && (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="text-[10px] tracking-[0.18em] uppercase text-stone-400 border-b border-stone-300 pb-0.5 hover:text-stone-900 hover:border-stone-900 transition-colors"
          >
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        )}
      </div>

      {/* Write review form */}
      {showForm && !submitted && (
        <div className="mb-12 pb-12 border-b border-stone-100">
          <ReviewForm
            productId={productId}
            onSubmitted={() => { setSubmitted(true); setShowForm(false); }}
          />
        </div>
      )}
      {submitted && (
        <p className="mb-10 text-sm text-stone-500 font-light italic">
          Thank you — your review has been submitted.
        </p>
      )}

      {totalReviews === 0 ? (
        <p className="text-sm text-stone-400 font-light">
          No reviews yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Rating summary */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-serif text-5xl font-light text-stone-900">
                {avgRating.toFixed(1)}
              </p>
              <Stars rating={avgRating} />
              <p className="text-xs text-stone-400 mt-1.5 font-light">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* Breakdown bars */}
            <div className="flex flex-col gap-2">
              {ratingBreakdown.map(({ star, count }) => {
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2.5">
                    <span className="text-[11px] text-stone-400 font-light w-4 shrink-0">
                      {star}
                    </span>
                    <div className="flex-1 h-1 bg-stone-100 overflow-hidden">
                      <div
                        className="h-full bg-[#2a1f18] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-stone-300 font-light w-4 text-right shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review list */}
          <div className="md:col-span-2 flex flex-col divide-y divide-stone-100">
            {reviews.map((review) => (
              <div key={review.id} className="py-7 first:pt-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-normal text-stone-900">
                      {review.user.name ?? "Anonymous"}
                    </p>
                    <p className="text-[10px] text-stone-300 font-light mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString("en-PK", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Stars rating={review.rating} />
                </div>
                <p className="text-sm text-stone-500 font-light leading-relaxed mt-3">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}