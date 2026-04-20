import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import { getUserByExternalId } from "@/lib/services/user.service";
import { getUserOrders, SerializedOrderItem } from "@/lib/services/order.service";
import { formatPrice } from "@/lib/utils";

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <Package size={40} className="text-stone-200 mb-6" strokeWidth={1} />
      <p className="font-serif text-3xl font-light text-stone-300 mb-3">
        No orders yet
      </p>
      <p className="text-sm text-stone-400 font-light mb-8">
        Your order history will appear here.
      </p>
      <Link
        href="/products"
        className="px-8 py-3 bg-[#2a1f18] text-[#f0ebe3] text-[11px] tracking-[0.2em] uppercase font-normal hover:bg-[#3d2f25] transition-colors"
      >
        Start Shopping
      </Link>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Order History",
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  const { userId: externalId } = await auth();
  if (!externalId) redirect("/sign-in");

  const user = await getUserByExternalId(externalId);
  if (!user) redirect("/sign-in");

  const orders = await getUserOrders(user.id);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="border-b border-stone-100 px-6 md:px-10 py-10">
        <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-2 font-light">
          Account
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-light">
          Order History
        </h1>
        <p className="text-sm text-stone-400 mt-2 font-light">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="px-6 md:px-10 py-8 max-w-4xl">
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const firstItem = order.orderItems[0];
              const extraCount = order.orderItems.length - 1;

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="group block border border-stone-100 hover:border-stone-300 transition-colors p-5 md:p-6"
                >
                  <div className="flex gap-5 items-start">
                    {/* Thumbnail stack */}
                    <div className="flex shrink-0">
                      {order.orderItems.slice(0, 3).map((item: SerializedOrderItem, i: number) => (
                        <div
                          key={item.id}
                          className="relative w-16 aspect-[3/4] bg-stone-100 overflow-hidden border border-white"
                          style={{ marginLeft: i > 0 ? "-12px" : "0", zIndex: 3 - i }}
                        >
                          {item.product.images[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              sizes="64px"
                              className="object-cover object-top"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-stone-200" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Order details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 font-light mb-1">
                            #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="font-serif text-lg font-normal text-stone-900 leading-snug">
                            {firstItem.product.name}
                            {extraCount > 0 && (
                              <span className="text-stone-400 font-light text-base">
                                {" "}+{extraCount} more
                              </span>
                            )}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 font-normal ${
                            order.isPaid
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "COD"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-stone-400 font-light">
                          {new Date(order.createdAt).toLocaleDateString("en-PK", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          {" · "}
                          {order.orderItems.length}{" "}
                          {order.orderItems.length === 1 ? "item" : "items"}
                        </p>
                        <p className="text-sm font-normal text-stone-900">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}