import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { getUserByExternalId } from "@/lib/services/user.service";
import { getWishlistByUserId } from "@/lib/services/wishlist.service";
import { formatPrice } from "@/lib/utils";
import { WishlistRemoveButton } from "@/components/account/wishlist-remove-button";

export default async function WishlistPage() {
  const { userId: externalId } = await auth();
  if (!externalId) redirect("/sign-in");

  const user = await getUserByExternalId(externalId);
  if (!user) redirect("/sign-in");

  const wishlist = await getWishlistByUserId(user.id);

  return (
    <main className="min-h-screen">
      <div className="border-b border-stone-100 px-6 md:px-10 py-10">
        <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-2 font-light">
          <Link href="/account" className="hover:text-stone-700 transition-colors">
            Account
          </Link>
          <span className="mx-2 text-stone-200">›</span>
          Wishlist
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-light">Wishlist</h1>
        <p className="text-sm text-stone-400 mt-2 font-light">
          {wishlist.products.length}{" "}
          {wishlist.products.length === 1 ? "item" : "items"}
        </p>
      </div>

      {wishlist.products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Heart size={40} className="text-stone-200 mb-6" strokeWidth={1} />
          <p className="font-serif text-3xl font-light text-stone-300 mb-3">
            Nothing saved yet
          </p>
          <p className="text-sm text-stone-400 font-light mb-8">
            Tap the heart on any product to save it here.
          </p>
          <Link
            href="/products"
            className="px-8 py-3 bg-[#2a1f18] text-[#f0ebe3] text-[11px] tracking-[0.2em] uppercase font-normal hover:bg-[#3d2f25] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {wishlist.products.map((product) => (
            <div key={product.id} className="group relative">
              {/* Remove button */}
              <WishlistRemoveButton productId={product.id} />

              <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden mb-3.5">
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
                </div>
                <p className="text-[10px] tracking-[0.12em] uppercase text-stone-400 mb-1">
                  {product.category.name}
                </p>
                <p className="font-serif text-lg font-normal text-stone-900 mb-1.5 group-hover:text-stone-500 transition-colors leading-snug">
                  {product.name}
                </p>
                <p className="text-sm text-stone-900 font-normal">
                  {formatPrice(product.price)}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}