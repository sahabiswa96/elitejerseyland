"use client";

import { useEffect, useMemo, useState } from "react";

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

const orderStatuses = [
  "ORDERED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const paymentStatuses = ["UNPAID", "PENDING", "PAID", "FAILED"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
    payload: {
      status?: Order["status"];
      paymentStatus?: Order["paymentStatus"];
    }
  ) {
    try {
      setUpdatingId(id);

      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Update failed");
      }

      await loadOrders();

      if (selectedOrder?.id === id) {
        await loadOrderDetails(id);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const totalOrders = useMemo(() => orders.length, [orders]);

  return (
    <main className="space-y-6 p-4 sm:p-6">
      <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_14px_36px_rgba(201,149,0,0.06)] md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#a87400]">
              Admin Orders
            </p>
            <h1 className="mt-2 text-2xl font-bold text-[#2b2112] md:text-3xl">
              Manage customer orders
            </h1>
            <p className="mt-2 text-sm text-[#7a6641]">
              Search, filter, review and update order progress and payment state.
            </p>
          </div>

          <div className="rounded-full border border-[rgba(201,149,0,0.16)] bg-[#fff6df] px-4 py-2 text-sm font-semibold text-[#a87400]">
            {totalOrders} Orders
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            placeholder="Search order / customer / email / phone"
            className="input-premium h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="input-premium h-11"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            {orderStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            className="input-premium h-11"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="">All Payment Status</option>
            {paymentStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadOrders}
              className="flex-1 rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Apply
            </button>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("");
                setPaymentStatus("");
                setTimeout(() => loadOrders(), 0);
              }}
              className="rounded-xl border border-[rgba(201,149,0,0.16)] bg-white px-4 py-3 text-sm font-semibold text-[#2b2112]"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <section className="overflow-hidden rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white shadow-[0_14px_36px_rgba(201,149,0,0.06)]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-[rgba(201,149,0,0.12)] bg-[#fffdf7]">
                <tr className="text-left">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#7a6641]">
                    Order
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#7a6641]">
                    Customer
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#7a6641]">
                    Amount
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#7a6641]">
                    Status
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#7a6641]">
                    Payment
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#7a6641]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-[#7a6641]"
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-[#7a6641]"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[rgba(201,149,0,0.08)] align-top"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#2b2112]">
                          {order.orderNumber}
                        </p>
                        <p className="mt-1 text-xs text-[#7a6641]">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-[#2b2112]">
                          {order.customerName}
                        </p>
                        <p className="mt-1 text-xs text-[#7a6641]">
                          {order.email}
                        </p>
                        <p className="mt-1 text-xs text-[#7a6641]">
                          {order.phone}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-semibold text-[#2b2112]">
                        ₹{order.total.toFixed(2)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#fff6df] px-3 py-1 text-xs font-semibold text-[#a87400]">
                          {order.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#f4f4f5] px-3 py-1 text-xs font-semibold text-slate-700">
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => loadOrderDetails(order.id)}
                            className="rounded-lg border border-[rgba(201,149,0,0.16)] bg-white px-3 py-2 text-xs font-semibold text-[#2b2112]"
                          >
                            View
                          </button>

                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrder(order.id, {
                                status: e.target.value as Order["status"],
                              })
                            }
                            disabled={updatingId === order.id}
                            className="rounded-lg border border-[rgba(201,149,0,0.16)] bg-white px-2 py-2 text-xs font-semibold text-[#2b2112]"
                          >
                            {orderStatuses.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>

                          <select
                            value={order.paymentStatus}
                            onChange={(e) =>
                              updateOrder(order.id, {
                                paymentStatus: e.target
                                  .value as Order["paymentStatus"],
                              })
                            }
                            disabled={updatingId === order.id}
                            className="rounded-lg border border-[rgba(201,149,0,0.16)] bg-white px-2 py-2 text-xs font-semibold text-[#2b2112]"
                          >
                            {paymentStatuses.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_14px_36px_rgba(201,149,0,0.06)] md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a87400]">
                Order Details
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#2b2112]">
                {selectedOrder ? selectedOrder.orderNumber : "Select an order"}
              </h2>
            </div>
          </div>

          {detailsLoading ? (
            <div className="mt-6 text-sm text-[#7a6641]">Loading details...</div>
          ) : !selectedOrder ? (
            <div className="mt-6 rounded-2xl border border-[rgba(201,149,0,0.12)] bg-[#fffdf7] p-6 text-sm text-[#7a6641]">
              Click “View” on any order to see complete order information.
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="space-y-2 text-sm text-[#2b2112]">
                <p>
                  <span className="font-semibold">Customer:</span>{" "}
                  {selectedOrder.customerName}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedOrder.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {selectedOrder.phone}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {selectedOrder.address}
                </p>
                <p>
                  <span className="font-semibold">Total:</span> ₹
                  {selectedOrder.total.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedOrder.status}
                </p>
                <p>
                  <span className="font-semibold">Payment:</span>{" "}
                  {selectedOrder.paymentStatus}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7a6641]">
                  Ordered Items
                </h3>

                <div className="mt-4 space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-[rgba(201,149,0,0.12)] bg-[#fffdf7] p-3"
                    >
                      <img
                        src={item.image || "/images/default-product.webp"}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-[#2b2112]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-[#7a6641]">
                          Qty: {item.quantity}
                        </p>
                        <p className="mt-1 text-xs text-[#7a6641]">
                          Price: ₹{item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-[#2b2112]">
                          ₹{item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    updateOrder(selectedOrder.id, {
                      status: e.target.value as Order["status"],
                    })
                  }
                  disabled={updatingId === selectedOrder.id}
                  className="input-premium h-11"
                >
                  {orderStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) =>
                    updateOrder(selectedOrder.id, {
                      paymentStatus: e.target.value as Order["paymentStatus"],
                    })
                  }
                  disabled={updatingId === selectedOrder.id}
                  className="input-premium h-11"
                >
                  {paymentStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}