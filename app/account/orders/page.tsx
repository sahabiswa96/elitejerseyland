"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  }[];
};

function statusStyles(status: Order["status"]) {
  if (status === "DELIVERED") return "bg-green-50 text-green-700";
  if (status === "SHIPPED") return "bg-blue-50 text-blue-700";
  if (status === "PACKED") return "bg-violet-50 text-violet-700";
  if (status === "ORDERED") return "bg-[#fff6df] text-[#a87400]";
  return "bg-red-50 text-red-600";
}

function paymentStyles(status: Order["paymentStatus"]) {
  if (status === "PAID") return "bg-green-50 text-green-700";
  if (status === "PENDING") return "bg-amber-50 text-amber-700";
  if (status === "FAILED") return "bg-red-50 text-red-600";
  return "bg-slate-100 text-slate-700";
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

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load orders");
      }

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
        <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white p-6 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
            My Orders
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#2b2112]">
            Order History
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7a6641]">
            Review your order history, payment status, and delivery progress.
          </p>
        </div>

        <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          {loading ? (
            <div className="py-10 text-center text-[#7a6641]">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-10 text-center text-[#7a6641]">
              No orders found yet.
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-[22px] border border-[rgba(201,149,0,0.12)] bg-[#fffdf7] p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#2b2112]">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 text-xs text-[#7a6641]">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentStyles(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:items-end">
                      <p className="text-lg font-bold text-[#2b2112]">
                        ₹{order.total.toFixed(2)}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/account/orders/${order.orderNumber}`}
                          className="rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                          View Details
                        </Link>

                        <Link
                          href={`/track-order?orderNumber=${order.orderNumber}`}
                          className="rounded-xl border border-[rgba(201,149,0,0.16)] bg-white px-4 py-2 text-sm font-semibold text-[#2b2112] transition hover:border-[rgba(201,149,0,0.28)] hover:text-[#a87400]"
                        >
                          Track Order
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-2xl border border-[rgba(201,149,0,0.10)] bg-white p-3"
                      >
                        <img
                          src={item.image || "/images/default-product.webp"}
                          alt={item.name}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#2b2112]">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-[#7a6641]">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.items.length > 3 ? (
                    <p className="mt-4 text-xs text-[#7a6641]">
                      + {order.items.length - 3} more item(s)
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}