import { getAdminOrders } from "@/lib/services/admin.service";
import { formatPrice } from "@/lib/utils";
import { OrderPaidToggle } from "@/components/admin/order-paid-toggle";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-stone-900">Orders</h1>
        <p className="text-sm text-stone-400 font-light mt-1">
          {orders.length} total
        </p>
      </div>

      <div className="border border-stone-100">
        <div className="grid grid-cols-[1fr_1fr_1fr_100px_80px] gap-4 px-5 py-3 border-b border-stone-100 bg-stone-50">
          {["Order", "Customer", "Total", "Status", ""].map((h) => (
            <p
              key={h}
              className="text-[9px] tracking-[0.18em] uppercase text-stone-400 font-medium"
            >
              {h}
            </p>
          ))}
        </div>

        {orders.length === 0 ? (
          <p className="text-sm text-stone-300 font-light text-center py-16">
            No orders yet
          </p>
        ) : (
          <div className="divide-y divide-stone-100">
            {orders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-[1fr_1fr_1fr_100px_80px] gap-4 px-5 py-3.5 items-center hover:bg-stone-50 transition-colors"
              >
                <div>
                  <p className="text-xs font-normal text-stone-900">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-stone-400 font-light mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-PK", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" · "}{order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-normal text-stone-900 truncate">
                    {order.userName}
                  </p>
                  <p className="text-[10px] text-stone-400 font-light truncate">
                    {order.userEmail}
                  </p>
                </div>
                <p className="text-sm font-normal text-stone-900">
                  {formatPrice(order.totalAmount)}
                </p>
                <OrderPaidToggle id={order.id} isPaid={order.isPaid} />
                <div className="text-xs text-stone-400 font-light truncate" title={order.address}>
                  {order.address.split(",")[0]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}