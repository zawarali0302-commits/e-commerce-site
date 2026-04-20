import { serializeProduct } from "@/lib/serialize";
import prisma from "../prisma";

export interface SerializedCartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    stock: number;
    category: { name: string };
  };
}

export interface SerializedCart {
  id: string;
  userId: string;
  items: SerializedCartItem[];
  totalItems: number;
  totalPrice: number;
}

function serializeCartItem(item: any): SerializedCartItem {
  return {
    id: item.id,
    cartId: item.cartId,
    productId: item.productId,
    quantity: item.quantity,
    product: {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.price),
      images: item.product.images,
      stock: item.product.stock,
      category: { name: item.product.category.name },
    },
  };
}


export async function getCartByUserId(
  userId: string
): Promise<SerializedCart | null> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: { include: { category: true } },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!cart) return null;

  const items = cart.items.map(serializeCartItem);
  return {
    id: cart.id,
    userId: cart.userId,
    items,
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    ),
  };
}

export async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { userId } });
}

export async function addToCart(userId: string, productId: string) {
  const cart = await getOrCreateCart(userId);

  // Check product stock
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product || product.isArchived) throw new Error("Product not available");

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existing) {
    if (existing.quantity >= product.stock) {
      throw new Error(`Only ${product.stock} units available`);
    }
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: { increment: 1 } },
    });
  }

  return prisma.cartItem.create({
    data: { cartId: cart.id, productId, quantity: 1 },
  });
}

export async function updateCartItemQuantity(
  userId: string,
  cartItemId: string,
  quantity: number
) {
  // Verify the item belongs to this user's cart
  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cart: { userId } },
    include: { product: true },
  });
  if (!item) throw new Error("Cart item not found");

  if (quantity <= 0) {
    return prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  if (quantity > item.product.stock) {
    throw new Error(`Only ${item.product.stock} units available`);
  }

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
}

export async function removeCartItem(userId: string, cartItemId: string) {
  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cart: { userId } },
  });
  if (!item) throw new Error("Cart item not found");
  return prisma.cartItem.delete({ where: { id: cartItemId } });
}

export async function clearCartByUserId(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;
  return prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}