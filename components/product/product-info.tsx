"use client";

import { useState } from "react";
import { Minus, Plus, Share2 } from "lucide-react";
import { WishlistButton } from "@/components/ui/wishlist-button";
import { SerializedProductWithCategory } from "@/lib/serialize";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/stores/cart.store";

interface ProductInfoProps {
  product: SerializedProductWithCategory;
  avgRating: number;
  totalReviews: number;
}

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 12 12"
          fill={star <= Math.round(rating) ? "#2a1f18" : "none"}
          stroke="#2a1f18"
          strokeWidth="1"
        >
          <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
        </svg>
      ))}
    </div>
  );
}

export function ProductInfo({ product, avgRating, totalReviews }: ProductInfoProps) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? "",
      category: product.category.name,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.name, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category + name */}
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-light">
          {product.category.name}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-light leading-snug text-stone-900">
          {product.name}
        </h1>
      </div>

      {/* Rating */}
      {totalReviews > 0 && (
        <button
          onClick={() =>
            document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })
          }
          className="flex items-center gap-2.5 w-fit"
        >
          <StarRating rating={avgRating} />
          <span className="text-[11px] text-stone-400 font-light">
            {avgRating.toFixed(1)} ({totalReviews}{" "}
            {totalReviews === 1 ? "review" : "reviews"})
          </span>
        </button>
      )}

      {/* Price */}
      <div>
        <p className="font-serif text-2xl font-light text-stone-900">
          {formatPrice(product.price)}
        </p>
        <p className="text-[10px] text-stone-400 mt-0.5 font-light">
          Inclusive of all taxes
        </p>
      </div>

      {/* Stock status */}
      <div>
        {!inStock && (
          <span className="text-[11px] tracking-[0.1em] uppercase text-red-400 font-light">
            Out of Stock
          </span>
        )}
        {lowStock && (
          <span className="text-[11px] tracking-[0.1em] uppercase text-amber-600 font-light">
            Only {product.stock} left
          </span>
        )}
        {inStock && !lowStock && (
          <span className="text-[11px] tracking-[0.1em] uppercase text-stone-400 font-light">
            In Stock
          </span>
        )}
      </div>

      {/* Quantity */}
      {inStock && (
        <div className="flex items-center gap-0">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 border border-stone-200 flex items-center justify-center hover:border-stone-400 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={13} className="text-stone-600" />
          </button>
          <span className="w-12 h-10 border-y border-stone-200 flex items-center justify-center text-sm font-light text-stone-900">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="w-10 h-10 border border-stone-200 flex items-center justify-center hover:border-stone-400 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={13} className="text-stone-600" />
          </button>
        </div>
      )}

      {/* CTA buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={cn(
            "flex-1 py-3.5 text-[11px] tracking-[0.2em] uppercase font-normal transition-all duration-200",
            inStock
              ? added
                ? "bg-stone-600 text-white"
                : "bg-[#2a1f18] text-[#f0ebe3] hover:bg-[#3d2f25]"
              : "bg-stone-100 text-stone-300 cursor-not-allowed"
          )}
        >
          {added ? "Added ✓" : inStock ? "Add to Bag" : "Sold Out"}
        </button>
        <WishlistButton
          productId={product.id}
          size={16}
          className="w-12 h-12 border border-stone-200 hover:border-stone-900"
        />
        <button
          onClick={handleShare}
          className="w-12 h-12 border border-stone-200 flex items-center justify-center hover:border-stone-900 transition-colors"
          aria-label="Share"
        >
          <Share2 size={15} className="text-stone-500" />
        </button>
      </div>

      {/* Description */}
      <div className="border-t border-stone-100 pt-6">
        <p className="text-sm leading-[1.85] text-stone-500 font-light">
          {product.description}
        </p>
      </div>

      {/* Accordion */}
      <ProductAccordion />
    </div>
  );
}

function ProductAccordion() {
  const [open, setOpen] = useState<string | null>(null);

  const items = [
    {
      id: "delivery",
      label: "Delivery & Shipping",
      content:
        "Free standard delivery on orders over PKR 3,000. Express delivery available at checkout. Estimated delivery: 3–5 business days nationwide.",
    },
    {
      id: "returns",
      label: "Returns & Exchanges",
      content:
        "Easy 7-day returns on all unworn, unwashed items with tags intact. Initiate a return from your account dashboard. Exchanges processed within 5–7 business days.",
    },
    {
      id: "care",
      label: "Care Instructions",
      content:
        "Hand wash or gentle machine wash in cold water. Do not bleach. Lay flat to dry. Iron on low heat. Dry clean recommended for embroidered pieces.",
    },
  ];

  return (
    <div className="border-t border-stone-100">
      {items.map((item) => (
        <div key={item.id} className="border-b border-stone-100">
          <button
            onClick={() => setOpen(open === item.id ? null : item.id)}
            className="w-full flex items-center justify-between py-4 text-left"
          >
            <span className="text-[11px] tracking-[0.15em] uppercase text-stone-700 font-normal">
              {item.label}
            </span>
            <span className="text-stone-400 text-lg leading-none">
              {open === item.id ? "−" : "+"}
            </span>
          </button>
          {open === item.id && (
            <p className="text-sm text-stone-400 font-light leading-relaxed pb-4">
              {item.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}