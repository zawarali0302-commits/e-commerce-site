"use client";

import Link from "next/link";
import Image from "next/image";
import { WishlistButton } from "@/components/ui/wishlist-button";
import { useState } from "react";
import { formatPrice, cn } from "@/lib/utils";
import { SerializedProductWithCategory } from "@/lib/serialize";
import { useCartStore } from "@/lib/stores/cart.store";

interface FeaturedProductsProps {
  products: SerializedProductWithCategory[];
}

function ProductCard({ product }: { product: SerializedProductWithCategory }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleQuickAdd = () => {
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
    setTimeout(() => setAdded(false), 1500);
  };

  const isNew =
    Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
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
    <div className="group">
      <div className="relative overflow-hidden bg-stone-100 aspect-[3/4] mb-3.5">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-stone-200" />
        )}

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

        <WishlistButton
          productId={product.id}
          size={14}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 hover:bg-white opacity-0 group-hover:opacity-100"
        />

        {!isOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-[#2a1f18] text-[#f0ebe3] py-3 text-[10px] tracking-[0.2em] uppercase font-normal hover:bg-[#3d2f25] transition-colors"
            >
              {added ? "Added ✓" : "Quick Add"}
            </button>
          </div>
        )}

        {isOutOfStock && <div className="absolute inset-0 bg-white/50" />}
      </div>

      <Link href={`/product/${product.slug}`} className="block">
        <p className="text-[10px] tracking-[0.12em] uppercase text-stone-400 mb-1">
          {product.category.name}
        </p>
        <p className="font-serif text-lg font-normal text-stone-900 mb-1.5 group-hover:text-stone-600 transition-colors">
          {product.name}
        </p>
        <p className={cn("text-sm", isOutOfStock ? "text-stone-300" : "text-stone-900 font-normal")}>
          {formatPrice(product.price)}
        </p>
      </Link>
    </div>
  );
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="px-6 md:px-10 py-14 md:py-20 bg-stone-50">
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-serif text-4xl md:text-5xl font-light leading-[1.1]">
          <em>Featured</em> Products
        </h2>
        <Link
          href="/products"
          className="text-[10px] tracking-[0.2em] uppercase text-stone-400 border-b border-stone-300 pb-0.5 hover:text-stone-900 hover:border-stone-900 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}