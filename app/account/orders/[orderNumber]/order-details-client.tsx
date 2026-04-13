"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  productId: string | null;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
  createdAt: string;
};

type Order = {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  total: number;
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "FAILED";
  status: "ORDERED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  items: OrderItem[];
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

export default function OrderDetailsClient({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadOrder() {
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Order not found");
      }

      setOrder(data.order || null);
    } catch (error) {
      console.error("LOAD_ORDER_DETAILS_ERROR", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <main className="container py-10 md:py-14">
        <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-10 text-center text-[#7a6641] shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          Loading order details...
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="container py-10 md:py-14">
        <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-10 text-center text-[#7a6641] shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          Order not found.
        </div>
      </main>
    );
  }

  return (
    <main className="container py-10 md:py-14">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
              Order Details
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#2b2112]">
              {order.orderNumber}
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#7a6641]">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${statusStyles(
                order.status
              )}`}
            >
              {order.status}
            </span>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${paymentStyles(
                order.paymentStatus
              )}`}
            >
              {order.paymentStatus}
            </span>

            <Link
              href={`/track-order?orderNumber=${order.orderNumber}`}
              className="rounded-xl border border-[rgba(201,149,0,0.16)] bg-white px-4 py-2 text-sm font-semibold text-[#2b2112] transition hover:border-[rgba(201,149,0,0.28)] hover:text-[#a87400]"
            >
              Track Order
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
            <h2 className="text-xl font-bold text-[#2b2112]">Ordered Items</h2>

            <div className="mt-5 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-[22px] border border-[rgba(201,149,0,0.12)] bg-[#fffdf7] p-4 sm:flex-row sm:items-center"
                >
                  <img
                    src={item.image || "/images/default-product.webp"}
                    alt={item.name}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-[#2b2112]">
                      {item.name}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#7a6641]">
                      <span>Qty: {item.quantity}</span>
                      <span>Price: ₹{item.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-[#2b2112]">
                      ₹{item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
              <h2 className="text-xl font-bold text-[#2b2112]">
                Delivery Details
              </h2>

              <div className="mt-5 space-y-3 text-sm text-[#2b2112]">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {order.customerName}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {order.phone}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {order.email}
                </p>
                <p>
                  <span className="font-semibold">Address:</span> {order.address}
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
              <h2 className="text-xl font-bold text-[#2b2112]">
                Payment Summary
              </h2>

              <div className="mt-5 flex items-center justify-between text-sm text-[#7a6641]">
                <span>Items Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>

              <div className="mt-4 border-t border-[rgba(201,149,0,0.12)] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-[#2b2112]">
                    Grand Total
                  </span>
                  <span className="text-xl font-bold text-[#2b2112]">
                    ₹{order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
              <Link
                href="/account/orders"
                className="inline-flex rounded-xl border border-[rgba(201,149,0,0.16)] bg-white px-4 py-2 text-sm font-semibold text-[#2b2112] transition hover:border-[rgba(201,149,0,0.28)] hover:text-[#a87400]"
              >
                Back to My Orders
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}