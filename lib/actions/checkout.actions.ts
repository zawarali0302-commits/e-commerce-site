"use server";

import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmailTemplate } from "@/lib/email-templates";
import { getUserById } from "@/lib/services/user.service";
import { CartItem } from "@/lib/stores/cart.store";
import { Prisma } from "@/app/generated/prisma/client";
import prisma from "../prisma";

export type CheckoutResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function syncCartToOrder(
  items: CartItem[],
  address: string,
  phone: string
): Promise<CheckoutResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "You must be signed in to checkout." };

  const user = await getUserById(session.user.id);
  if (!user) return { success: false, error: "User not found." };

  if (items.length === 0) return { success: false, error: "Your cart is empty." };

  // Re-fetch prices and stock from DB — never trust client
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isArchived: false },
  });

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return { success: false, error: `"${item.name}" is no longer available.` };
    if (product.stock < item.quantity) {
      return { success: false, error: `Only ${product.stock} units of "${item.name}" available.` };
    }
  }

  const totalAmount = products.reduce((sum, product) => {
    const cartItem = items.find((i) => i.productId === product.id)!;
    return sum + Number(product.price) * cartItem.quantity;
  }, 0);

  try {
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          address,
          phone,
          totalAmount: new Prisma.Decimal(totalAmount),
          isPaid: false,
          orderItems: {
            create: items.map((item) => {
              const product = products.find((p) => p.id === item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: product.price,
              };
            }),
          },
        },
      });

      await Promise.all(
        items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );

      return newOrder;
    });

    // Send order confirmation email
    await sendEmail({
      to: user.email,
      subject: `Order Confirmed — #${order.id.slice(-8).toUpperCase()}`,
      html: orderConfirmationEmailTemplate({
        orderId: order.id,
        name: user.name,
        items: items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            name: item.name,
            quantity: item.quantity,
            price: Number(product.price),
          };
        }),
        totalAmount,
        address,
        phone,
      }),
    });

    return { success: true, orderId: order.id };
  } catch (err) {
    console.error("syncCartToOrder error:", err);
    return { success: false, error: "Failed to place order. Please try again." };
  }
}