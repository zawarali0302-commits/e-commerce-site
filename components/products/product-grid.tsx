"use client";

import Link from "next/link";
import Image from "next/image";
import { WishlistButton } from "@/components/ui/wishlist-button";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SerializedProductWithCategory, SerializedCategory } from "@/lib/serialize";
import { formatPrice, cn } from "@/lib/utils";
import { addToCartAction } from "@/lib/actions/cart.actions";



// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: SerializedProductWithCategory }) {
  const [hovered, setHovered] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleQuickAdd = () => {
    startTransition(async () => { await addToCartAction(product.id) });
  };

  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    7 * 24 * 60 * 60 * 1000;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const badge = isOutOfStock
    ? { label: "Sold Out", dark: false }
    : isNew
      ? { label: "New In", dark: true }
      : isLowStock
        ? { label: "Low Stock", dark: false }
        : null;

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-stone-100 aspect-[3/4] mb-3.5">
        {product.images.length > 0 ? (
          <>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={cn(
                "object-cover object-top transition-opacity duration-500",
                hovered && product.images[1] ? "opacity-0" : "opacity-100"
              )}
            />
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt={`${product.name} – alternate view`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className={cn(
                  "object-cover object-top transition-opacity duration-500",
                  hovered ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-stone-200" />
        )}

        {/* Badge */}
        {badge && (
          <div
            className={cn(
              "absolute top-3 left-3 text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 font-normal",
              badge.dark
                ? "bg-[#2a1f18] text-[#f0ebe3]"
                : "bg-white text-stone-600 border border-stone-200"
            )}
          >
            {badge.label}
          </div>
        )}

        {/* Wishlist */}
        <WishlistButton
          productId={product.id}
          size={13}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 hover:bg-white opacity-0 group-hover:opacity-100"
        />

        {/* Quick Add */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={handleQuickAdd} className="w-full bg-[#2a1f18] text-[#f0ebe3] py-3 text-[10px] tracking-[0.2em] uppercase font-normal hover:bg-[#3d2f25] transition-colors">
              Quick Add
            </button>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/50" />
        )}
      </div>

      {/* Info */}
      <Link href={`/product/${product.slug}`}>
        <p className="text-[10px] tracking-[0.12em] uppercase text-stone-400 mb-1">
          {product.category.name}
        </p>
        <p className="font-serif text-[17px] font-normal text-stone-900 mb-1.5 leading-snug group-hover:text-stone-500 transition-colors">
          {product.name}
        </p>
        <p
          className={cn(
            "text-sm",
            isOutOfStock ? "text-stone-300" : "text-stone-900 font-normal"
          )}
        >
          {formatPrice(product.price)}
        </p>
      </Link>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="font-serif text-3xl font-light text-stone-300 mb-4">
        No products found
      </p>
      <p className="text-sm text-stone-400 font-light max-w-xs">
        Try adjusting your filters or browse all products.
      </p>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  // Build page number array with ellipsis
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1 mt-14 transition-opacity",
        isPending && "opacity-50"
      )}
    >
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-[11px] tracking-[0.12em] uppercase text-stone-400 disabled:opacity-30 hover:text-stone-900 transition-colors"
      >
        ← Prev
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-stone-300 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={cn(
              "w-8 h-8 text-[12px] font-light transition-colors",
              currentPage === p
                ? "bg-[#2a1f18] text-white"
                : "text-stone-500 hover:text-stone-900"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-[11px] tracking-[0.12em] uppercase text-stone-400 disabled:opacity-30 hover:text-stone-900 transition-colors"
      >
        Next →
      </button>
    </div>
  );
}

// ─── Product Grid ─────────────────────────────────────────────────────────────

interface ProductGridProps {
  products: SerializedProductWithCategory[];
  currentPage: number;
  totalPages: number;
}

export function ProductGrid({
  products,
  currentPage,
  totalPages,
}: ProductGridProps) {
  if (products.length === 0) return <EmptyState />;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}