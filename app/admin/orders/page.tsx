"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Trash2 } from "lucide-react";

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
  utr: string | null;
  paymentScreenshot: string | null;
  createdAt: string;
  items: OrderItem[];
};

const orderStatuses = ["ORDERED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const paymentStatuses = ["UNPAID", "PENDING", "PAID", "FAILED"] as const;

function getStatusClasses(status: string) {
  if (status === "DELIVERED") return "bg-green-50 text-green-700 border border-green-200";
  if (status === "SHIPPED") return "bg-blue-50 text-blue-700 border border-blue-200";
  if (status === "PACKED") return "bg-violet-50 text-violet-700 border border-violet-200";
  if (status === "ORDERED") return "bg-[#fff6df] text-[#a87400] border border-[rgba(201,149,0,0.2)]";
  return "bg-red-50 text-red-600 border border-red-200";
}

function getPaymentClasses(status: string) {
  if (status === "PAID") return "bg-green-50 text-green-700 border border-green-200";
  if (status === "PENDING") return "bg-amber-50 text-amber-700 border border-amber-200";
  if (status === "FAILED") return "bg-red-50 text-red-600 border border-red-200";
  return "bg-gray-50 text-gray-600 border border-gray-200";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // নতুন স্টেট: মাল্টিপল সিলেক্ট ও ডিলিট
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingBulk, setDeletingBulk] = useState(false);

  async function loadOrders() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);
      if (paymentStatus) params.set("paymentStatus", paymentStatus);

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      setOrders(data.orders || []);
      // ফিল্টার চেঞ্জ করলে সিলেকশন রিসেট করা হবে
      setSelectedIds([]); 
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadOrderDetails(id: string) {
    setDetailsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      setSelectedOrder(data.order || null);
    } catch (error) {
      console.error(error);
      setSelectedOrder(null);
    } finally {
      setDetailsLoading(false);
    }
  }

  async function updateOrder(
    id: string,
    payload: { status?: Order["status"]; paymentStatus?: Order["paymentStatus"] }
  ) {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");

      await loadOrders();
      if (selectedOrder?.id === id) await loadOrderDetails(id);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  // সবগুলো সিলেক্ট / আনসিলেক্ট করার লজিক
  const toggleSelectAll = () => {
    if (selectedIds.length === orders.length && orders.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((o) => o.id));
    }
  };

  // একটা নির্দিষ্ট অর্ডার সিলেক্ট/আনসিলেক্ট করার লজিক
  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // বাল্ক ডিলিট হ্যান্ডলার
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected order(s)? This cannot be undone.`)) return;

    setDeletingBulk(true);
    try {
      const res = await fetch("/api/admin/orders/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids: selectedIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // যদি ডান পাশে যেই অর্ডার ওপেন আছে সেটা ডিলিট করা হলে বন্ধ করে দেও
      if (selectedOrder && selectedIds.includes(selectedOrder.id)) {
        setSelectedOrder(null);
      }

      setSelectedIds([]);
      await loadOrders();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Bulk delete failed");
    } finally {
      setDeletingBulk(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const totalOrders = useMemo(() => orders.length, [orders]);
  const isAllSelected = orders.length > 0 && selectedIds.length === orders.length;

  return (
    <main className="space-y-6 p-4 sm:p-6">
      {/* Top Filters */}
      <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_14px_36px_rgba(201,149,0,0.06)] md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#a87400]">Admin Orders</p>
            <h1 className="mt-2 text-2xl font-bold text-[#2b2112] md:text-3xl">Manage Orders</h1>
            <p className="mt-2 text-sm text-[#7a6641]">Search, filter, update, or bulk delete orders.</p>
          </div>
          <div className="rounded-full border border-[rgba(201,149,0,0.16)] bg-[#fff6df] px-4 py-2 text-sm font-semibold text-[#a87400]">
            {totalOrders} Orders
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input type="text" placeholder="Search order / customer / phone" className="input-premium h-11" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input-premium h-11" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            {orderStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="input-premium h-11" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
            <option value="">All Payments</option>
            {paymentStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <div className="flex gap-3">
            <button type="button" onClick={loadOrders} className="flex-1 rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">Apply</button>
            <button type="button" onClick={() => { setSearch(""); setStatus(""); setPaymentStatus(""); setTimeout(() => loadOrders(), 0); }} className="rounded-xl border border-[rgba(201,149,0,0.16)] bg-white px-4 py-3 text-sm font-semibold text-[#2b2112] hover:bg-[#fffdf7]">Reset</button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] h-[calc(100vh-220px)] min-h-[500px]">
        
        {/* LEFT: Orders Table */}
        <section className="flex flex-col overflow-hidden rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white shadow-[0_14px_36px_rgba(201,149,0,0.06)] relative">
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full">
              <thead className="sticky top-0 z-20 border-b border-[rgba(201,149,0,0.12)] bg-[#faf8f0]">
                <tr className="text-left">
                  {/* চেকবক্স কলাম */}
                  <th className="px-5 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-[#c99500] focus:ring-[#c99500] cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a7a6b]">Order</th>
                  <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a7a6b]">Customer</th>
                  <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a7a6b]">Amount</th>
                  <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a7a6b]">Status</th>
                  <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a7a6b]">Payment</th>
                  <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a7a6b] text-center">Action</th>
                </tr>
              </thead>

              <tbody className="overflow-y-auto">
                {loading ? (
                  <tr><td colSpan={7} className="px-5 py-20 text-center text-sm text-[#7a6641]">Loading orders...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-20 text-center text-sm text-[#7a6641]">No orders found.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className={`border-b border-[rgba(201,149,0,0.06)] transition-colors hover:bg-[#fffdf7] ${
                        selectedIds.includes(order.id) ? "bg-[#fff9e6]" : ""
                      }`}
                    >
                      {/* রো চেকবক্স */}
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(order.id)}
                          onChange={() => toggleSelectOne(order.id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#c99500] focus:ring-[#c99500] cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-sm font-bold text-[#2b2112]">{order.orderNumber}</p>
                        <p className="mt-1 text-[11px] text-[#9b8b6f]">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-[#2b2112]">{order.customerName}</p>
                        <p className="mt-0.5 text-[11px] text-[#9b8b6f]">{order.phone}</p>
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-[#2b2112]">₹{order.total.toFixed(2)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusClasses(order.status)}`}>{order.status}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${getPaymentClasses(order.paymentStatus)}`}>{order.paymentStatus}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button type="button" onClick={() => loadOrderDetails(order.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(201,149,0,0.2)] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#a87400] transition hover:bg-[#fff6df] hover:border-[#c99500]">
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ==========================================
               BULK ACTION BAR (সিলেক্ট করলে নিচে দেখাবে)
          ========================================== */}
          {selectedIds.length > 0 && (
            <div className="sticky bottom-0 z-30 border-t border-[rgba(201,149,0,0.15)] bg-white px-6 py-4 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
              <p className="text-sm font-semibold text-[#2b2112]">
                <span className="text-[#c99500]">{selectedIds.length}</span> Order(s) Selected
              </p>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={deletingBulk}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 size={16} />
                {deletingBulk ? "Deleting..." : "Delete Selected"}
              </button>
            </div>
          )}
        </section>

        {/* RIGHT: Order Details Panel */}
        <aside className="overflow-y-auto rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white shadow-[0_14px_36px_rgba(201,149,0,0.06)]">
          <div className="sticky top-0 z-10 border-b border-[rgba(201,149,0,0.1)] bg-white px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a87400]">Order Details</p>
            <h2 className="mt-1 text-xl font-bold text-[#2b2112]">
              {selectedOrder ? selectedOrder.orderNumber : "Select an order"}
            </h2>
          </div>

          <div className="p-6">
            {detailsLoading ? (
              <div className="py-10 text-center text-sm text-[#7a6641]">Loading details...</div>
            ) : !selectedOrder ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff6df] text-[#c99500]"><Eye size={28} /></div>
                <p className="mt-4 text-sm text-[#7a6641]">Click “View” on any order to see details.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-2">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClasses(selectedOrder.status)}`}>{selectedOrder.status}</span>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${getPaymentClasses(selectedOrder.paymentStatus)}`}>{selectedOrder.paymentStatus}</span>
                </div>

                {/* Payment Proof */}
                {(selectedOrder.utr || selectedOrder.paymentScreenshot) && (
                  <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-4 space-y-4">
                    <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Submitted Payment Proof</p>
                    {selectedOrder.utr && <div><p className="text-xs text-[#7a6641]">UTR Reference</p><p className="text-base font-bold text-[#2b2112] font-mono tracking-wider">{selectedOrder.utr}</p></div>}
                    {selectedOrder.paymentScreenshot && (
                      <div>
                        <p className="text-xs text-[#7a6641] mb-2">Payment Screenshot</p>
                        <img src={selectedOrder.paymentScreenshot} alt="Proof" className="h-auto max-h-[250px] w-full rounded-lg border border-blue-100 object-cover cursor-pointer hover:shadow-md transition" onClick={(e) => window.open((e.target as HTMLImageElement).src, '_blank')} />
                      </div>
                    )}
                    <p className="text-[11px] text-blue-600 font-medium">Verify in bank app before approving.</p>
                  </div>
                )}

                <div className="rounded-2xl border border-[rgba(201,149,0,0.1)] bg-[#fafaf9] p-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#9b8b6f] mb-3">Customer Info</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div><p className="text-xs text-[#9b8b6f]">Name</p><p className="text-sm font-semibold text-[#2b2112]">{selectedOrder.customerName}</p></div>
                    <div><p className="text-xs text-[#9b8b6f]">Phone</p><p className="text-sm font-semibold text-[#2b2112]">{selectedOrder.phone}</p></div>
                    <div className="sm:col-span-2"><p className="text-xs text-[#9b8b6f]">Email</p><p className="text-sm font-semibold text-[#2b2112] break-all">{selectedOrder.email}</p></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[rgba(201,149,0,0.1)] bg-[#fafaf9] p-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#9b8b6f] mb-2">Shipping Address</p>
                  <p className="text-sm font-medium text-[#2b2112] leading-relaxed">{selectedOrder.address}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#9b8b6f] mb-3">Items Ordered</p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-[rgba(201,149,0,0.1)] bg-white p-3 shadow-sm">
                        <img src={item.image || "/images/default-product.webp"} alt={item.name} className="h-14 w-14 rounded-xl object-cover border border-[rgba(201,149,0,0.1)]" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#2b2112]">{item.name}</p>
                          <p className="mt-0.5 text-xs text-[#7a6641]">Qty: {item.quantity} • ₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="text-right"><p className="text-sm font-bold text-[#2b2112]">₹{item.subtotal.toFixed(2)}</p></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-[#fff6df] px-4 py-3 border border-[rgba(201,149,0,0.15)]">
                    <span className="text-sm font-semibold text-[#7a6641]">Total Amount</span>
                    <span className="text-lg font-bold text-[#2b2112]">₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-dashed border-[rgba(201,149,0,0.2)] bg-[#fffdf7] p-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#a87400] mb-3 font-bold">Update Order</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-[#7a6641] mb-1 block">Order Status</label>
                      <select value={selectedOrder.status} onChange={(e) => updateOrder(selectedOrder.id, { status: e.target.value as Order["status"] })} disabled={updatingId === selectedOrder.id} className="w-full h-11 rounded-xl border border-[rgba(201,149,0,0.2)] bg-white px-4 pr-10 text-sm font-semibold text-[#2b2112] outline-none transition focus:border-[#c99500] disabled:bg-gray-50 disabled:cursor-not-allowed">
                        {orderStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#7a6641] mb-1 block">Payment Status</label>
                      <select value={selectedOrder.paymentStatus} onChange={(e) => updateOrder(selectedOrder.id, { paymentStatus: e.target.value as Order["paymentStatus"] })} disabled={updatingId === selectedOrder.id} className="w-full h-11 rounded-xl border border-[rgba(201,149,0,0.2)] bg-white px-4 pr-10 text-sm font-semibold text-[#2b2112] outline-none transition focus:border-[#c99500] disabled:bg-gray-50 disabled:cursor-not-allowed">
                        {paymentStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                    {updatingId === selectedOrder.id && <p className="text-xs text-center text-[#a87400] animate-pulse font-medium">Updating...</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}