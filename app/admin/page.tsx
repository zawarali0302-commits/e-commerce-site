import Link from "next/link";
import { getAdminStats } from "@/lib/services/admin.service";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, ShoppingBag, Package, Users } from "lucide-react";

export default async function AdminPage() {
  const stats = await getAdminStats();

  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      sub: "Paid orders only",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      sub: "All time",
    },
    {
      label: "Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      sub: "Active listings",
    },
    {
      label: "Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      sub: "Registered users",
    },
  ];

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-stone-900">Overview</h1>
        <p className="text-sm text-stone-400 font-light mt-1">
          {new Date().toLocaleDateString("en-PK", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <div key={card.label} className="border border-stone-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] tracking-[0.18em] uppercase text-stone-400 font-medium">
                {card.label}
              </p>
              <card.icon size={14} className="text-stone-300" strokeWidth={1.5} />
            </div>
            <p className="font-serif text-2xl font-light text-stone-900">
              {card.value}
            </p>
            <p className="text-[10px] text-stone-300 font-light mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="border border-stone-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h2 className="text-[10px] tracking-[0.18em] uppercase text-stone-700 font-medium">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-[10px] tracking-[0.12em] uppercase text-stone-400 hover:text-stone-700 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {stats.recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-sm text-stone-300 font-light text-center">
                No orders yet
              </p>
            ) : (
              stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-stone-50 transition-colors"
                >
                  <div>
                    <p className="text-xs font-normal text-stone-900">
                      {order.userName}
                    </p>
                    <p className="text-[10px] text-stone-400 font-light mt-0.5">
                      #{order.id.slice(-8).toUpperCase()} · {order.itemCount}{" "}
                      {order.itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-normal text-stone-900">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <span
                      className={`text-[9px] tracking-[0.1em] uppercase ${
                        order.isPaid ? "text-green-600" : "text-amber-600"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "COD"}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Low stock */}
        <div className="border border-stone-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h2 className="text-[10px] tracking-[0.18em] uppercase text-stone-700 font-medium">
              Low Stock Alerts
            </h2>
            <Link
              href="/admin/products"
              className="text-[10px] tracking-[0.12em] uppercase text-stone-400 hover:text-stone-700 transition-colors"
            >
              Manage
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {stats.lowStockProducts.length === 0 ? (
              <p className="px-5 py-8 text-sm text-stone-300 font-light text-center">
                All products well stocked
              </p>
            ) : (
              stats.lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.slug}/edit`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-stone-50 transition-colors"
                >
                  <p className="text-xs font-normal text-stone-900">
                    {product.name}
                  </p>
                  <span
                    className={`text-[10px] font-medium tracking-[0.1em] ${
                      product.stock === 0 ? "text-red-500" : "text-amber-600"
                    }`}
                  >
                    {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}