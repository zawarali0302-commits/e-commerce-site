import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getUserByExternalId } from "@/lib/services/user.service";
import { getCartByUserId } from "@/lib/services/cart.service";
import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Your Bag",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const { userId: externalId } = await auth();
  if (!externalId) redirect("/sign-in");

  const user = await getUserByExternalId(externalId);
  if (!user) redirect("/sign-in");

  const cart = await getCartByUserId(user.id);

  return <CartPageClient cart={cart} />;
}