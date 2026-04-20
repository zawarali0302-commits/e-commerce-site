import { serializeProduct, serializeCategory } from "@/lib/serialize";
import prisma from "@/lib/prisma";

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const [
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { isPaid: true },
      _sum: { totalAmount: true },
    }),
    prisma.order.count(),
    prisma.product.count({ where: { isArchived: false } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, orderItems: true },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 }, isArchived: false },
      take: 5,
      orderBy: { stock: "asc" },
    }),
  ]);

  return {
    totalRevenue: Number(totalRevenue._sum.totalAmount ?? 0),
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      isPaid: o.isPaid,
      totalAmount: Number(o.totalAmount),
      createdAt: o.createdAt.toISOString(),
      itemCount: o.orderItems.length,
      userName: o.user.name ?? o.user.email,
    })),
    lowStockProducts: lowStockProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      stock: p.stock,
    })),
  };
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getAdminProducts() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProduct);
}

export async function getAdminProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) return null;
  return serializeProduct(product);
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getAdminOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((o) => ({
    id: o.id,
    isPaid: o.isPaid,
    phone: o.phone,
    address: o.address,
    totalAmount: Number(o.totalAmount),
    createdAt: o.createdAt.toISOString(),
    itemCount: o.orderItems.length,
    userName: o.user.name ?? o.user.email,
    userEmail: o.user.email,
  }));
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getAdminCategories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });

  return categories.map((c) => ({
    ...serializeCategory(c),
    productCount: c._count.products,
  }));
}