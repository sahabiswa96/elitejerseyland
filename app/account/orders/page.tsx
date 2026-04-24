"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Eye, MapPin } from "lucide-react";

type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: "ORDERED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  items: {
    id: string;
    name: string;
    image: string;
    quantity: number;
    subtotal: number;
    price?: number;
  }[];
};

function statusStyles(status: Order["status"]) {
  if (status === "DELIVERED") return "bg-green-50 text-green-700 border border-green-200";
  if (status === "SHIPPED") return "bg-blue-50 text-blue-700 border border-blue-200";
  if (status === "PACKED") return "bg-violet-50 text-violet-700 border border-violet-200";
  if (status === "ORDERED") return "bg-[#fff6df] text-[#a87400] border border-[rgba(201,149,0,0.2)]";
  return "bg-red-50 text-red-600 border border-red-200";
}

function paymentStyles(status: Order["paymentStatus"]) {
  if (status === "PAID") return "bg-green-50 text-green-700 border border-green-200";
  if (status === "PENDING") return "bg-amber-50 text-amber-700 border border-amber-200";
  if (status === "FAILED") return "bg-red-50 text-red-600 border border-red-200";
  return "bg-slate-50 text-slate-600 border border-slate-200";
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load orders");

      setOrders(data.orders || []);
    } catch (error) {
      console.error("LOAD_MY_ORDERS_ERROR", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <main className="container py-10 md:py-14">
      <div className="space-y-8">
        {/* Header Card */}
        <div className="relative overflow-hidden rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white p-6 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-[#c99500] opacity-[0.06] blur-2xl" />
          <p className="relative text-[11px] font-semibold uppercase tracking-[0.3em] text-[#a87400]">
            My Orders
          </p>
          <h1 className="relative mt-2 text-3xl font-bold text-[#2b2112]">
            Order History
          </h1>
          <p className="relative mt-3 max-w-2xl text-sm leading-7 text-[#7a6641]">
            Review your order history, payment status, and delivery progress.
          </p>
        </div>

        {/* Orders List Container */}
        <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white/60 shadow-[0_12px_28px_rgba(201,149,0,0.05)] backdrop-blur-sm p-5">
          
          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-[#7a6641]">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#c99500] border-t-transparent"></div>
              <p className="text-sm font-medium">Fetching your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff6df] border border-[rgba(201,149,0,0.15)]">
                <ShoppingBag size={36} className="text-[#c99500]" />
              </div>
              <h3 className="text-lg font-bold text-[#2b2112]">No orders yet</h3>
              <p className="mt-2 max-w-sm text-sm text-[#7a6641]">
                Looks like you haven&apos;t placed any orders. Start shopping to see them here!
              </p>
              <Link
                href="/catalog"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
              >
                <ShoppingBag size={16} />
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="group overflow-hidden rounded-[22px] border border-[rgba(201,149,0,0.1)] bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[rgba(201,149,0,0.2)]"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-base font-bold text-[#2b2112]">
                            {order.orderNumber}
                          </h3>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusStyles(order.status)}`}>
                            {order.status}
                          </span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${paymentStyles(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-[#9b8b6f]">
                          Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN", { 
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:items-end">
                        <div className="text-left lg:text-right">
                          <p className="text-[10px] uppercase tracking-widest text-[#9b8b6f]">Total Paid</p>
                          <p className="text-xl font-bold text-[#2b2112]">
                            ₹{order.total.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="flex w-full gap-2 sm:w-auto">
                          <Link
                            href={`/account/orders/${order.orderNumber}`}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 sm:flex-initial"
                          >
                            <Eye size={14} />
                            View Details
                          </Link>

                          <Link
                            href={`/track-order?orderNumber=${order.orderNumber}`}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[rgba(201,149,0,0.2)] bg-white px-4 py-2.5 text-xs font-semibold text-[#2b2112] transition hover:bg-[#fff6df] hover:border-[#c99500] sm:flex-initial"
                          >
                            <MapPin size={14} />
                            Track
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-[rgba(201,149,0,0.12)] bg-[#fafaf8]/50 px-5 py-4 sm:px-6">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-xl border border-[rgba(201,149,0,0.06)] bg-white p-2.5"
                        >
                          <img
                            src={item.image || "/images/default-product.webp"}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover shadow-sm"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-[#2b2112]">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-[#9b8b6f]">
                              Qty: {item.quantity} × ₹{item.price?.toFixed(2) || item.subtotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.items.length > 3 && (
                      <Link 
                        href={`/account/orders/${order.orderNumber}`}
                        className="mt-3 inline-block text-[11px] font-medium text-[#a87400] transition hover:underline"
                      >
                        + {order.items.length - 3} more item(s) →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}