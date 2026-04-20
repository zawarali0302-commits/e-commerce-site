"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart.store";
import { formatPrice, cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { syncCartToOrder } from "@/lib/actions/checkout.actions";

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <ShoppingBag size={40} className="text-stone-200 mb-6" strokeWidth={1} />
      <p className="font-serif text-3xl font-light text-stone-300 mb-3">
        Your bag is empty
      </p>
      <p className="text-sm text-stone-400 font-light mb-8">
        Looks like you haven't added anything yet.
      </p>
      <Link
        href="/products"
        className="px-8 py-3 bg-[#2a1f18] text-[#f0ebe3] text-[11px] tracking-[0.2em] uppercase font-normal hover:bg-[#3d2f25] transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

function CartItemRow({ item }: { item: ReturnType<typeof useCartStore.getState>["items"][0] }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-6 border-b border-stone-100">
      <Link href={`/product/${item.slug}`} className="shrink-0">
        <div className="relative w-24 aspect-[3/4] bg-stone-100 overflow-hidden">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover object-top" />
          ) : (
            <div className="absolute inset-0 bg-stone-200" />
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] tracking-[0.12em] uppercase text-stone-400 mb-1">{item.category}</p>
            <Link href={`/product/${item.slug}`}>
              <p className="font-serif text-lg font-normal text-stone-900 leading-snug hover:text-stone-500 transition-colors">
                {item.name}
              </p>
            </Link>
          </div>
          <button onClick={() => removeItem(item.productId)} className="text-stone-300 hover:text-stone-600 transition-colors shrink-0 mt-0.5">
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="w-8 h-8 border border-stone-200 flex items-center justify-center hover:border-stone-400 transition-colors"
            >
              <Minus size={12} className="text-stone-500" />
            </button>
            <span className="w-10 h-8 border-y border-stone-200 flex items-center justify-center text-sm font-light text-stone-900">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="w-8 h-8 border border-stone-200 flex items-center justify-center hover:border-stone-400 transition-colors disabled:opacity-40"
            >
              <Plus size={12} className="text-stone-500" />
            </button>
          </div>
          <p className="font-normal text-stone-900 text-sm">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        {item.stock <= 5 && (
          <p className="text-[10px] text-amber-600 mt-2 font-light">Only {item.stock} left in stock</p>
        )}
      </div>
    </div>
  );
}

function CheckoutForm({ onSubmit, loading, error }: { onSubmit: (address: string, phone: string) => void; loading: boolean; error: string }) {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(address, phone); }} className="mt-6 flex flex-col gap-4">
      <div>
        <label className="text-[10px] tracking-[0.15em] uppercase text-stone-500 block mb-1.5 font-medium">Phone Number</label>
        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03XX XXXXXXX"
          className="w-full border border-stone-200 px-4 py-2.5 text-sm text-stone-900 font-light placeholder:text-stone-300 outline-none focus:border-stone-400 transition-colors" />
      </div>
      <div>
        <label className="text-[10px] tracking-[0.15em] uppercase text-stone-500 block mb-1.5 font-medium">Delivery Address</label>
        <textarea required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address, city, province" rows={3}
          className="w-full border border-stone-200 px-4 py-2.5 text-sm text-stone-900 font-light placeholder:text-stone-300 outline-none focus:border-stone-400 transition-colors resize-none" />
      </div>
      {error && <p className="text-xs text-red-400 font-light">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-3.5 bg-[#2a1f18] text-[#f0ebe3] text-[11px] tracking-[0.2em] uppercase font-normal hover:bg-[#3d2f25] transition-colors disabled:opacity-50">
        {loading ? "Placing Order..." : "Place Order (COD)"}
      </button>
    </form>
  );
}

export function CartPageClient() {
  const { items, totalItems, totalPrice, clearCart } = useCartStore();
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const subtotal = totalPrice();
  const shipping = subtotal >= 3000 ? 0 : 250;
  const total = subtotal + shipping;

  const handleCheckout = async (address: string, phone: string) => {
    setLoading(true);
    setError("");
    const result = await syncCartToOrder(items, address, phone);
    if (result.success) {
      clearCart();
      router.push(`/orders/${result.orderId}?success=true`);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="border-b border-stone-100 px-6 md:px-10 py-6">
        <Link href="/products" className="inline-flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-stone-400 hover:text-stone-700 transition-colors mb-4">
          <ArrowLeft size={12} /> Continue Shopping
        </Link>
        <h1 className="font-serif text-4xl font-light">
          Your Bag{" "}
          {totalItems() > 0 && <span className="text-stone-300 text-2xl">({totalItems()})</span>}
        </h1>
      </div>

      {items.length === 0 ? <EmptyCart /> : (
        <div className="px-6 md:px-10 py-8 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">
          <div className="md:col-span-2">
            {items.map((item) => <CartItemRow key={item.productId} item={item} />)}
            <button onClick={clearCart} className="mt-4 text-[10px] tracking-[0.15em] uppercase text-stone-300 hover:text-red-400 transition-colors">
              Clear bag
            </button>
          </div>

          <div className="md:sticky md:top-24">
            <div className="border border-stone-100 p-6">
              <h2 className="text-[10px] tracking-[0.2em] uppercase text-stone-900 font-medium mb-6">Order Summary</h2>
              <div className="flex flex-col gap-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-stone-400 font-light">Subtotal</span>
                  <span className="font-normal">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400 font-light">Shipping</span>
                  <span className={cn("font-normal", shipping === 0 && "text-green-600")}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && <p className="text-[10px] text-stone-300 font-light">Free shipping on orders over PKR 3,000</p>}
                <div className="border-t border-stone-100 pt-3 flex justify-between">
                  <span className="font-medium text-stone-900">Total</span>
                  <span className="font-medium text-stone-900">{formatPrice(total)}</span>
                </div>
              </div>
              <div className="flex gap-1.5 mb-4 flex-wrap">
                {["COD", "JazzCash", "Easypaisa", "Visa"].map((m) => (
                  <span key={m} className="px-2 py-1 bg-stone-50 border border-stone-100 text-[9px] tracking-[0.1em] text-stone-400">{m}</span>
                ))}
              </div>
              {isSignedIn ? (
                <CheckoutForm onSubmit={handleCheckout} loading={loading} error={error} />
              ) : (
                <div className="mt-6">
                  <p className="text-xs text-stone-400 font-light mb-4 text-center">Sign in to complete your order</p>
                  <Link href="/sign-in" className="block w-full py-3.5 bg-[#2a1f18] text-[#f0ebe3] text-[11px] tracking-[0.2em] uppercase font-normal text-center hover:bg-[#3d2f25] transition-colors">
                    Sign In to Checkout
                  </Link>
                  <Link href="/sign-up" className="block w-full py-3 mt-2 border border-stone-200 text-[11px] tracking-[0.2em] uppercase text-stone-600 font-normal text-center hover:border-stone-900 transition-colors">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}