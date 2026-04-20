import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { getOrderById } from "@/lib/services/order.service";
import { getUserByExternalId } from "@/lib/services/user.service";
import { formatPrice } from "@/lib/utils";

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ success?: string }>;
}

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { orderId } = await params;
  const { success } = await searchParams;

  const { userId: externalId } = await auth();
  if (!externalId) redirect("/sign-in");

  const [user, order] = await Promise.all([
    getUserByExternalId(externalId),
    getOrderById(orderId),
  ]);

  if (!order || !user) notFound();

  // Ensure the order belongs to the current user
  if (order.userId !== user.id) notFound();

  const isConfirmation = success === "true";

  return (
    <main className="min-h-screen px-6 md:px-10 py-12 max-w-3xl mx-auto">
      {/* Success banner */}
      {isConfirmation && (
        <div className="flex items-center gap-4 bg-green-50 border border-green-100 px-6 py-5 mb-10">
          <CheckCircle size={22} className="text-green-500 shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-green-800">Order placed successfully</p>
            <p className="text-xs text-green-600 font-light mt-0.5">
              We'll contact you on {order.phone} to confirm delivery.
            </p>
          </div>
        </div>
      )}

      {/* Order header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-stone-100">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1 font-light">
            Order
          </p>
          <h1 className="font-serif text-3xl font-light text-stone-900">
            #{orderId.slice(-8).toUpperCase()}
          </h1>
          <p className="text-xs text-stone-400 font-light mt-1.5">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-PK", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
          <span
            className={`inline-block text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 font-normal ${
              order.isPaid
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-amber-50 text-amber-700 border border-amber-100"
            }`}
          >
            {order.isPaid ? "Paid" : "Cash on Delivery"}
          </span>
        </div>
      </div>

      {/* Order items */}
      <div className="mb-8">
        <h2 className="text-[10px] tracking-[0.2em] uppercase text-stone-500 font-medium mb-4">
          Items
        </h2>
        <div className="flex flex-col divide-y divide-stone-100">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex gap-4 py-5">
              <Link href={`/product/${item.product.slug}`} className="shrink-0">
                <div className="relative w-20 aspect-[3/4] bg-stone-100 overflow-hidden">
                  {item.product.images[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-stone-200" />
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-[0.12em] uppercase text-stone-400 mb-1">
                  {item.product.category.name}
                </p>
                <Link href={`/product/${item.product.slug}`}>
                  <p className="font-serif text-lg font-normal text-stone-900 leading-snug hover:text-stone-500 transition-colors">
                    {item.product.name}
                  </p>
                </Link>
                <p className="text-xs text-stone-400 font-light mt-1">
                  Qty: {item.quantity} × {formatPrice(item.priceAtPurchase)}
                </p>
              </div>
              <p className="text-sm font-normal text-stone-900 shrink-0">
                {formatPrice(item.priceAtPurchase * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery + total */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-stone-100">
        {/* Delivery info */}
        <div>
          <h2 className="text-[10px] tracking-[0.2em] uppercase text-stone-500 font-medium mb-3">
            Delivery Details
          </h2>
          <p className="text-sm text-stone-600 font-light leading-relaxed">
            {order.address}
          </p>
          <p className="text-sm text-stone-600 font-light mt-1">{order.phone}</p>
        </div>

        {/* Price breakdown */}
        <div>
          <h2 className="text-[10px] tracking-[0.2em] uppercase text-stone-500 font-medium mb-3">
            Payment Summary
          </h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-400 font-light">Subtotal</span>
              <span className="font-normal">{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400 font-light">Shipping</span>
              <span className="font-normal text-green-600">Free</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-100">
              <span className="font-medium text-stone-900">Total</span>
              <span className="font-medium text-stone-900">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-10 pt-8 border-t border-stone-100">
        <Link
          href="/orders"
          className="flex-1 py-3 border border-stone-200 text-[11px] tracking-[0.2em] uppercase text-stone-600 font-normal text-center hover:border-stone-900 hover:text-stone-900 transition-colors"
        >
          All Orders
        </Link>
        <Link
          href="/products"
          className="flex-1 py-3 bg-[#2a1f18] text-[#f0ebe3] text-[11px] tracking-[0.2em] uppercase font-normal text-center hover:bg-[#3d2f25] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}