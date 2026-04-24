"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, MapPin, Phone, Mail, User, 
  Package, CreditCard, Eye 
} from "lucide-react";

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
      if (!res.ok) throw new Error(data?.message || "Order not found");

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
        <div className="flex min-h-[400px] items-center justify-center rounded-[30px] border border-[rgba(201,149,0,0.14)] bg-white/80 shadow-xl backdrop-blur-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#c99500] border-t-transparent"></div>
            <p className="text-sm text-[#7a6641]">Loading order details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="container py-10 md:py-14">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[30px] border border-[rgba(201,149,0,0.14)] bg-white/80 shadow-xl backdrop-blur-sm">
          <p className="text-[#7a6641]">Order not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-10 md:py-14">
      <div className="space-y-6">
        
        {/* Top Header Section */}
        <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Link 
                href="/account/orders" 
                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(201,149,0,0.15)] bg-[#fffdf7] text-[#a87400] transition hover:bg-[#fff6df]"
              >
                <ArrowLeft size={18} />
              </Link>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9b8b6f]">
                  Order Details
                </p>
                <h1 className="mt-1 text-2xl font-bold text-[#2b2112] md:text-3xl">
                  {order.orderNumber}
                </h1>
                <p className="mt-1 text-sm text-[#7a6641]">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase ${statusStyles(order.status)}`}>
                {order.status}
              </span>
              <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase ${paymentStyles(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
              <Link
                href={`/track-order?orderNumber=${order.orderNumber}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(201,149,0,0.2)] bg-white px-4 py-2 text-xs font-semibold text-[#2b2112] transition hover:bg-[#fff6df] hover:border-[#c99500]"
              >
                <Eye size={14} />
                Live Tracking
              </Link>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          
          {/* LEFT: Ordered Items */}
          <section className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fff6df] text-[#c99500]">
                <Package size={20} />
              </div>
              <h2 className="text-xl font-bold text-[#2b2112]">Ordered Items</h2>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-[rgba(201,149,0,0.08)] bg-[#fafaf8] p-4 transition hover:bg-white hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="overflow-hidden rounded-xl border border-[rgba(201,149,0,0.1)]">
                    <img
                      src={item.image || "/images/default-product.webp"}
                      alt={item.name}
                      className="h-24 w-24 object-cover transition group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#2b2112] sm:text-base">
                      {item.name}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#9b8b6f]">
                      <span>Qty: <span className="font-semibold text-[#2b2112]">{item.quantity}</span></span>
                      <span>Price: <span className="font-semibold text-[#2b2112]">₹{item.price.toFixed(2)}</span></span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-[#9b8b6f]">Subtotal</p>
                    <p className="text-lg font-bold text-[#2b2112]">
                      ₹{item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT: Details Sidebar */}
          <aside className="space-y-6">
            
            {/* Delivery Details */}
            <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#2b2112] mb-4">Delivery Details</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff6df] text-[#c99500]">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#9b8b6f]">Customer Name</p>
                    <p className="text-sm font-semibold text-[#2b2112]">{order.customerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff6df] text-[#c99500]">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#9b8b6f]">Phone Number</p>
                    <p className="text-sm font-semibold text-[#2b2112]">{order.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff6df] text-[#c99500]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#9b8b6f]">Email Address</p>
                    <p className="text-sm font-semibold text-[#2b2112] break-all">{order.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff6df] text-[#c99500]">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#9b8b6f]">Delivery Address</p>
                    <p className="text-sm font-medium leading-relaxed text-[#2b2112]">{order.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#c99500] border border-[rgba(201,149,0,0.15)]">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-lg font-bold text-[#2b2112]">Payment Summary</h2>
              </div>

              <div className="flex items-center justify-between text-sm text-[#7a6641]">
                <span>Items Total</span>
                <span className="font-medium text-[#2b2112]">₹{order.total.toFixed(2)}</span>
              </div>

              <div className="mt-4 border-t border-[rgba(201,149,0,0.15)] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#2b2112]">Grand Total</span>
                  <span className="text-2xl font-bold text-[#2b2112]">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}