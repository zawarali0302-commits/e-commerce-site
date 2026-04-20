import { serializeProduct, SerializedProductWithCategory } from "@/lib/serialize";
import prisma from "@/lib/prisma";

export interface SerializedOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  product: SerializedProductWithCategory;
}

export interface SerializedOrder {
  id: string;
  userId: string;
  isPaid: boolean;
  phone: string;
  address: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  orderItems: SerializedOrderItem[];
}

function serializeOrder(order: any): SerializedOrder {
  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    orderItems: order.orderItems.map((item: any): SerializedOrderItem => ({
      ...item,
      priceAtPurchase: Number(item.priceAtPurchase),
      product: serializeProduct({
        ...item.product,
        category: item.product.category,
      }),
    })),
  };
}

export async function getOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          product: { include: { category: true } },
        },
      },
      user: true,
    },
  });

  if (!order) return null;
  return serializeOrder(order);
}

export async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: { include: { category: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map(serializeOrder);
}