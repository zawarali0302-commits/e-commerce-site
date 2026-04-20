import { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUserByExternalId } from "@/lib/services/user.service";
import { getUserOrders } from "@/lib/services/order.service";
import { getWishlistByUserId } from "@/lib/services/wishlist.service";
import { formatPrice } from "@/lib/utils";
import { Package, Heart, ChevronRight } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const { userId: externalId } = await auth();
  if (!externalId) redirect("/sign-in");

  const [clerkUser, user] = await Promise.all([
    currentUser(),
    getUserByExternalId(externalId),
  ]);

  if (!user || !clerkUser) redirect("/sign-in");

  const [orders, wishlist] = await Promise.all([
    getUserOrders(user.id),
    getWishlistByUserId(user.id),
  ]);

  const recentOrders = orders.slice(0, 3);
  const wishlistPreview = wishlist.products.slice(0, 4);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="border-b border-stone-100 px-6 md:px-10 py-10">
        <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-2 font-light">
          My Account
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-light">
          {user.name ?? "My Account"}
        </h1>
      </div>

      <div className="px-6 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left — profile card */}
        <div className="flex flex-col gap-4">
          {/* Profile */}
          <div className="border border-stone-100 p-6">
            <div className="flex items-center gap-4 mb-5">
              {clerkUser.imageUrl ? (
                <Image
                  src={clerkUser.imageUrl}
                  alt={user.name ?? "Avatar"}
                  width={52}
                  height={52}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-13 h-13 rounded-full bg-stone-100 flex items-center justify-center">
                  <span className="font-serif text-xl text-stone-400">
                    {(user.name ?? user.email)[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-normal text-stone-900">{user.name}</p>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs text-stone-400 font-light border-t border-stone-100 pt-4">
              <div className="flex justify-between">
                <span>Member since</span>
                <span className="text-stone-600">
                  {new Date(user.createdAt).toLocaleDateString("en-PK", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total orders</span>
                <span className="text-stone-600">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Wishlist items</span>
                <span className="text-stone-600">{wishlist.products.length}</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="border border-stone-100 divide-y divide-stone-100">
            {[
              { label: "Order History", href: "/orders", icon: Package },
              { label: "Wishlist", href: "/account/wishlist", icon: Heart },
            ].map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon size={14} className="text-stone-400" strokeWidth={1.5} />
                  <span className="text-sm font-normal text-stone-700">{label}</span>
                </div>
                <ChevronRight size={14} className="text-stone-300" />
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <SignOutButton>
            <button className="w-full py-2.5 border border-stone-200 text-[10px] tracking-[0.18em] uppercase text-stone-400 font-normal hover:border-stone-400 hover:text-stone-700 transition-colors">
              Sign Out
            </button>
          </SignOutButton>
        </div>

        {/* Right — orders + wishlist */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Recent orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] tracking-[0.2em] uppercase text-stone-700 font-medium">
                Recent Orders
              </h2>
              <Link
                href="/orders"
                className="text-[10px] tracking-[0.12em] uppercase text-stone-400 hover:text-stone-700 border-b border-stone-200 pb-0.5 transition-colors"
              >
                View all
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="border border-stone-100 py-12 text-center">
                <Package size={28} className="text-stone-200 mx-auto mb-3" strokeWidth={1} />
                <p className="text-sm text-stone-300 font-light">No orders yet</p>
                <Link
                  href="/products"
                  className="inline-block mt-4 text-[10px] tracking-[0.15em] uppercase text-stone-400 border-b border-stone-200 pb-0.5 hover:text-stone-700 transition-colors"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between border border-stone-100 hover:border-stone-300 transition-colors px-5 py-4"
                  >
                    <div>
                      <p className="text-[10px] tracking-[0.12em] uppercase text-stone-400 font-light">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm font-normal text-stone-900 mt-0.5">
                        {order.orderItems.length}{" "}
                        {order.orderItems.length === 1 ? "item" : "items"}
                      </p>
                      <p className="text-xs text-stone-400 font-light mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-PK", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-normal text-stone-900">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <span
                        className={`text-[9px] tracking-[0.1em] uppercase mt-1 inline-block ${
                          order.isPaid ? "text-green-600" : "text-amber-600"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "COD"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] tracking-[0.2em] uppercase text-stone-700 font-medium">
                Wishlist
              </h2>
              {wishlist.products.length > 0 && (
                <Link
                  href="/account/wishlist"
                  className="text-[10px] tracking-[0.12em] uppercase text-stone-400 hover:text-stone-700 border-b border-stone-200 pb-0.5 transition-colors"
                >
                  View all ({wishlist.products.length})
                </Link>
              )}
            </div>

            {wishlistPreview.length === 0 ? (
              <div className="border border-stone-100 py-12 text-center">
                <Heart size={28} className="text-stone-200 mx-auto mb-3" strokeWidth={1} />
                <p className="text-sm text-stone-300 font-light">
                  No saved items yet
                </p>
                <Link
                  href="/products"
                  className="inline-block mt-4 text-[10px] tracking-[0.15em] uppercase text-stone-400 border-b border-stone-200 pb-0.5 hover:text-stone-700 transition-colors"
                >
                  Browse products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wishlistPreview.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden mb-2.5">
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
                    <p className="font-serif text-sm font-normal text-stone-900 leading-snug group-hover:text-stone-500 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-stone-400 font-light mt-0.5">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}