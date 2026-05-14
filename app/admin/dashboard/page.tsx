"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardStatCard from "@/app/components/admin/DashboardStatCard";
import OrdersOverviewChart from "@/app/components/admin/OrdersOverviewChart";

type DashboardStats = {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  unpaidOrders: number;
  paidOrders: number;
};

type RecentOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: "ORDERED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "FAILED";
  createdAt: string;
};

type MonthlyOverview = {
  month: string;
  orders: number;
  revenue: number;
};

type DashboardResponse = {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  monthlyOverview: MonthlyOverview[];
};

function statusStyles(status: RecentOrder["status"]) {
  if (status === "DELIVERED") return "bg-green-50 text-green-700";
  if (status === "SHIPPED") return "bg-blue-50 text-blue-700";
  if (status === "PACKED") return "bg-violet-50 text-violet-700";
  if (status === "ORDERED") return "bg-[#fff6df] text-[#a87400]";
  return "bg-red-50 text-red-600";
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [monthlyOverview, setMonthlyOverview] = useState<MonthlyOverview[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/dashboard", {
        credentials: "include",
        cache: "no-store",
      });

      const data: DashboardResponse = await res.json();

      if (!res.ok) {
        throw new Error(data ? "Failed to load dashboard" : "Unknown error");
      }

      setStats(data.stats || null);
      setRecentOrders(data.recentOrders || []);
      setMonthlyOverview(data.monthlyOverview || []);
    } catch (error) {
      console.error("DASHBOARD_LOAD_ERROR", error);
      setStats(null);
      setRecentOrders([]);
      setMonthlyOverview([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const bestMonth = useMemo(() => {
    if (!monthlyOverview.length) return null;
    return [...monthlyOverview].sort((a, b) => b.revenue - a.revenue)[0];
  }, [monthlyOverview]);

  const topOrderMonth = useMemo(() => {
    if (!monthlyOverview.length) return null;
    return [...monthlyOverview].sort((a, b) => b.orders - a.orders)[0];
  }, [monthlyOverview]);

  const paymentImpact = useMemo(() => {
    if (!stats || stats.totalOrders === 0) return "0% Paid";
    const percent = Math.round((stats.paidOrders / stats.totalOrders) * 100);
    return `${percent}% Paid`;
  }, [stats]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
          Dashboard
        </p>
        <h2 className="mt-2 text-3xl font-bold text-[#2b2112]">
          Store Overview
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7a6641]">
          Monitor orders, payments, products, and store growth from one place.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-10 text-center text-[#7a6641] shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardStatCard
              title="Total Orders"
              value={`${stats?.totalOrders ?? 0}`}
            />
            <DashboardStatCard
              title="Total Customers"
              value={`${stats?.totalCustomers ?? 0}`}
            />
            <DashboardStatCard
              title="Payment Summary"
              value={`₹${(stats?.totalRevenue ?? 0).toFixed(2)}`}
            />
            <DashboardStatCard
              title="Total Products"
              value={`${stats?.totalProducts ?? 0}`}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <OrdersOverviewChart data={monthlyOverview} />

            <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
              <h3 className="text-xl font-bold text-[#2b2112]">Quick Summary</h3>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-white p-4">
                  <p className="text-sm font-semibold text-[#2b2112]">
                    Best Revenue Month
                  </p>
                  <p className="mt-2 text-lg font-bold text-[#c99500]">
                    {bestMonth
                      ? `${bestMonth.month}`
                      : "No data"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-white p-4">
                  <p className="text-sm font-semibold text-[#2b2112]">
                    Highest Order Volume
                  </p>
                  <p className="mt-2 text-lg font-bold text-[#c99500]">
                    {topOrderMonth
                      ? `${topOrderMonth.month}`
                      : "No data"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-white p-4">
                  <p className="text-sm font-semibold text-[#2b2112]">
                    Current Payment Impact
                  </p>
                  <p className="mt-2 text-lg font-bold text-[#c99500]">
                    {paymentImpact}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-[#2b2112]">Recent Orders</h3>
              <span className="rounded-full bg-[#fff6df] px-3 py-1 text-xs font-semibold text-[#a87400]">
                Latest Updates
              </span>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-[rgba(201,149,0,0.12)] text-sm text-[#7a6641]">
                    <th className="px-3 py-3 font-medium">Order ID</th>
                    <th className="px-3 py-3 font-medium">Customer</th>
                    <th className="px-3 py-3 font-medium">Amount</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-8 text-center text-sm text-[#7a6641]"
                      >
                        No recent orders found.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-[rgba(201,149,0,0.08)] text-sm text-[#2b2112]"
                      >
                        <td className="px-3 py-4 font-medium">
                          {order.orderNumber}
                        </td>
                        <td className="px-3 py-4">{order.customerName}</td>
                        <td className="px-3 py-4">
                          ₹{order.total.toFixed(2)}
                        </td>
                        <td className="px-3 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}