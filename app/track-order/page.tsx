"use client";

import { useState, useEffect } from "react";
import { 
  Search, Package, CheckCircle2, Truck, CircleDot, XCircle, 
  Phone, Mail, ShieldCheck, Headphones, Lock, ArrowRight, MapPin, Trophy
} from "lucide-react";

type OrderStatus = "ORDERED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
type PaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED";

type OrderItem = { name: string; price: number; quantity: number; image: string; };
type Order = {
  orderNumber: string; customerName: string; total: number;
  paymentStatus: PaymentStatus; status: OrderStatus; createdAt: string; items: OrderItem[];
};

const TRACKING_STEPS = [
  { key: "ORDERED", label: "Order Placed", desc: "Your order has been confirmed", icon: CircleDot },
  { key: "PACKED", label: "Packed", desc: "Your jersey is packed securely", icon: Package },
  { key: "SHIPPED", label: "Shipped", desc: "Out for delivery", icon: Truck },
  { key: "DELIVERED", label: "Delivered", desc: "Successfully delivered", icon: CheckCircle2 },
];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrackOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true); setError(""); setOrder(null);
    try {
      const res = await fetch("/api/track-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderNumber }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrder(data.order);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  }


  useEffect(() => {
    if (!order) return;

    // প্রতি ১০ সেকেন্ড অন্তর সার্ভারে যাবে নতুন ডাটা চেক করতে
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/track-order?_t=${Date.now()}`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Cache-Control": "no-cache" 
          },
          body: JSON.stringify({ orderNumber: order.orderNumber }),
        });

        if (res.ok) {
          const data = await res.json();
          setOrder(data.order); // নতুন ডাটা দিয়ে আপডেট করে দিবে
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 5000); // ৫ সেকেন্ডে একবার চেক করবে

    return () => clearInterval(interval);
  }, [order?.orderNumber]);


  const getCurrentStepIndex = () => {
    if (!order || order.status === "CANCELLED") return -1;
    const index = TRACKING_STEPS.findIndex((step) => step.key === order.status);
    return index === -1 ? 0 : index;
  };

  return (
    <main className="container py-10 md:py-14">
      <section className="relative overflow-hidden rounded-[30px] border border-[rgba(201,149,0,0.14)] bg-white/80 shadow-[0_20px_60px_rgba(201,149,0,0.08)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,149,0,0.12),transparent_28%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,149,0,0.05),transparent_22%)]" />

        <div className="relative grid gap-8 px-5 py-8 sm:px-6 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
          
          {/* LEFT COLUMN */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a87400]">
              Real-time Tracking
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-[#2b2112] md:text-4xl">
              Track your jersey order.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#7a6641] md:text-base">
              Enter your order number below to get live updates on your order status, from packing to delivery at your doorstep.
            </p>

            {/* Search Form */}
            <form onSubmit={handleTrackOrder} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b8a898] pointer-events-none" size={18} />
                <input
                  type="text"
                  placeholder="e.g., ORD-XXXXXXX"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  className="w-full h-12 rounded-xl border border-[rgba(201,149,0,0.2)] bg-[#fafaf9] pl-11 pr-4 text-sm text-[#2b2112] placeholder:text-gray-400 outline-none transition focus:border-[#c99500] focus:ring-2 focus:ring-[rgba(201,149,0,0.1)]"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !orderNumber.trim()}
                className="h-12 rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-8 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Track Order"
                )}
              </button>
            </form>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}

            {/* EMPTY STATE */}
            {!order && (
              <div className="mt-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#a87400] mb-6">
                  How it works
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 relative">
                  <div className="hidden sm:block absolute top-6 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-[#e5dcc8] via-[#c99500] to-[#e5dcc8] z-0" />
                  
                  {[
                    { icon: Search, title: "Enter ID", desc: "Paste the ID from your confirmation message" },
                    { icon: MapPin, title: "Track Live", desc: "View real-time packing and shipping status" },
                    { icon: Trophy, title: "Get Jersey", desc: "Receive your authentic jersey at your door" },
                  ].map((step, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff6df] border border-[rgba(201,149,0,0.2)] text-[#c99500] shadow-sm transition-transform group-hover:scale-110">
                        <step.icon size={22} />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-[#2b2112]">{step.title}</p>
                      <p className="mt-1 text-xs text-[#7a6641] leading-relaxed max-w-[180px]">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ORDER DETAILS STATE */}
            {order && (
              <div className="mt-10 space-y-6">
                
                {/* Status Timeline */}
                <div className="rounded-[26px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-5 shadow-[0_12px_32px_rgba(201,149,0,0.06)]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#2b2112]">
                      Order #{order.orderNumber}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        order.status === "CANCELLED" ? "bg-red-50 text-red-600" : "bg-[#fff6df] text-[#a87400]"
                      }`}>
                        {order.status}
                      </span>
                      {/* লাইভ ইন্ডিকেটর যোগ করা হয়েছে */}
                      <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    </div>
                  </div>

                  {order.status === "CANCELLED" ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center bg-red-50/50 rounded-2xl border border-red-100">
                      <XCircle size={40} className="text-red-400 mb-2" />
                      <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
                    </div>
                  ) : (
                    <div className="relative ml-3">
                      <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#f1e7c9]" />
                      <div className="space-y-7">
                        {TRACKING_STEPS.map((step, index) => {
                          const currentStepIndex = getCurrentStepIndex();
                          const isCompleted = index < currentStepIndex;
                          const isActive = index === currentStepIndex;
                          const Icon = step.icon;
                          return (
                            <div key={step.key} className="relative flex gap-4">
                              <div className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                                isCompleted ? "border-green-500 bg-green-500" : isActive ? "border-[#c99500] bg-[#c99500] animate-pulse" : "border-[#e5dcc8] bg-white"
                              }`}>
                                <Icon size={14} className={`transition-all ${isCompleted || isActive ? "text-white" : "text-[#c9bca8]"}`} />
                              </div>
                              <div className="-mt-1">
                                <p className={`text-sm font-semibold ${isCompleted ? "text-green-700" : isActive ? "text-[#2b2112]" : "text-[#b8a898]"}`}>
                                  {step.label}
                                  {isActive && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#c99500]" />}
                                </p>
                                <p className={`text-xs mt-0.5 ${isActive ? "text-[#7a6641]" : "text-[#c9bca8]"}`}>{step.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment & Items */}
                <div className="rounded-[26px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_32px_rgba(201,149,0,0.06)] space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-[#fffdf7] p-4 border border-[rgba(201,149,0,0.1)]">
                      <p className="text-xs text-[#9b8b6f]">Payment Status</p>
                      <p className={`mt-1 text-sm font-bold ${
                        order.paymentStatus === "PAID" ? "text-green-600" : order.paymentStatus === "PENDING" ? "text-amber-600" : "text-red-600"
                      }`}>{order.paymentStatus}</p>
                    </div>
                    <div className="rounded-xl bg-[#fffdf7] p-4 border border-[rgba(201,149,0,0.1)]">
                      <p className="text-xs text-[#9b8b6f]">Total Amount</p>
                      <p className="mt-1 text-lg font-bold text-[#2b2112]">₹{order.total.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  <div className="border-t border-[rgba(201,149,0,0.1)] pt-5">
                    <p className="text-sm font-bold text-[#2b2112] mb-4">Items Ordered</p>
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 rounded-2xl border border-[rgba(201,149,0,0.08)] bg-[#fffdf7] p-3">
                          <img src={item.image || "/images/default-product.webp"} alt={item.name} className="h-14 w-14 rounded-xl object-cover border border-[rgba(201,149,0,0.1)]" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#2b2112] truncate">{item.name}</p>
                            <p className="text-xs text-[#7a6641] mt-1">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-[#2b2112]">₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-xs text-[#9b8b6f] pt-2">
                    Ordered on: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:pl-2">
            <div className="rounded-[26px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-5 shadow-[0_12px_32px_rgba(201,149,0,0.06)] md:p-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
                Our Promise
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#2b2112]">
                Worry-Free Shopping
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#7a6641]">
                Premium jerseys with a clean shopping experience, strong product focus, and secure deliveries.
              </p>

              <div className="mt-6 space-y-4">
                {[
                  { icon: ShieldCheck, label: "100% Authentic", sub: "Premium quality guaranteed" },
                  { icon: Truck, label: "Pan-India Delivery", sub: "Reliable shipping partners" },
                  { icon: Headphones, label: "Dedicated Support", sub: "WhatsApp & Call assistance" },
                  { icon: Lock, label: "Secure Payments", sub: "100% safe UPI transactions" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-[rgba(201,149,0,0.15)] text-[#c99500]">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2b2112]">{item.label}</p>
                      <p className="text-xs text-[#9b8b6f]">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a 
                href="/" 
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Continue Shopping
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="mt-5 rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
                Need Help?
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <a href="tel:+918981537417" className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-[#fffdf7] p-4 transition hover:border-[rgba(201,149,0,0.25)]">
                  <Phone size={18} className="text-[#c99500]" />
                  <h3 className="mt-3 text-sm font-semibold text-[#2b2112]">Call Support</h3>
                  <p className="mt-1 text-sm text-[#7a6641]">+91 8981537417</p>
                </a>

                <a href="mailto:sahabiswa180@gmail.com" className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-[#fffdf7] p-4 transition hover:border-[rgba(201,149,0,0.25)]">
                  <Mail size={18} className="text-[#c99500]" />
                  <h3 className="mt-3 text-sm font-semibold text-[#2b2112]">Email Us</h3>
                  <p className="mt-1 text-sm text-[#7a6641] break-all">sahabiswa180@gmail.com</p>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}