"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { getUserByExternalId } from "@/lib/services/user.service";
import {
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  getCartByUserId,
} from "@/lib/services/cart.service";
import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";

async function getAuthUser() {
  const { userId: externalId } = await auth();
  if (!externalId) return null;
  return getUserByExternalId(externalId);
}

export async function addToCartAction(productId: string) {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Sign in to add items to your bag" };

  try {
    await addToCart(user.id, productId);
    revalidatePath("/cart");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message ?? "Could not add item" };
  }
}

export async function updateCartQuantityAction(cartItemId: string, quantity: number) {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    await updateCartItemQuantity(user.id, cartItemId, quantity);
    revalidatePath("/cart");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message ?? "Could not update quantity" };
  }
}

export async function removeCartItemAction(cartItemId: string) {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    await removeCartItem(user.id, cartItemId);
    revalidatePath("/cart");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message ?? "Could not remove item" };
  }
}

export type CheckoutResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function checkoutAction(address: string, phone: string): Promise<CheckoutResult> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "You must be signed in to checkout." };

  const cart = await getCartByUserId(user.id);
  if (!cart || cart.items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  const productIds = cart.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isArchived: false },
  });

  for (const item of cart.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return { success: false, error: `"${item.product.name}" is no longer available.` };
    if (product.stock < item.quantity) {
      return { success: false, error: `Only ${product.stock} units of "${item.product.name}" available.` };
    }
  }

  const totalAmount = products.reduce((sum, product) => {
    const cartItem = cart.items.find((i) => i.productId === product.id)!;
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
            create: cart.items.map((item) => {
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
        cart.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    revalidatePath("/cart");
    return { success: true, orderId: order.id };
  } catch (err) {
    console.error("checkoutAction error:", err);
    return { success: false, error: "Failed to place order. Please try again." };
  }
}