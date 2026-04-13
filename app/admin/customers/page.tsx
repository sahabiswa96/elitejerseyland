"use client";

import { useEffect, useMemo, useState } from "react";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadCustomers(query?: string) {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (query?.trim()) params.set("search", query.trim());

      const res = await fetch(`/api/admin/customers?${params.toString()}`, {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load customers");
      }

      setCustomers(data.customers || []);
    } catch (error) {
      console.error("CUSTOMERS_LOAD_ERROR", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const totalCustomers = useMemo(() => customers.length, [customers]);

  const totalSpent = useMemo(
    () => customers.reduce((sum, customer) => sum + customer.totalSpent, 0),
    [customers]
  );

  const activeCustomers = useMemo(
    () => customers.filter((customer) => customer.isActive).length,
    [customers]
  );

  return (
    <main className="space-y-8">
      <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white p-6 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
          Customers
        </p>
        <h2 className="mt-2 text-3xl font-bold text-[#2b2112]">
          Customer Overview
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7a6641]">
          Review customer accounts, order activity, spending insights, and
          recent engagement from one place.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#7a6641]">
            Total Customers
          </p>
          <h3 className="mt-3 text-3xl font-bold text-[#2b2112]">
            {totalCustomers}
          </h3>
        </div>

        <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#7a6641]">
            Active Customers
          </p>
          <h3 className="mt-3 text-3xl font-bold text-[#2b2112]">
            {activeCustomers}
          </h3>
        </div>

        <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#7a6641]">
            Total Customer Spend
          </p>
          <h3 className="mt-3 text-3xl font-bold text-[#2b2112]">
            ₹{totalSpent.toFixed(2)}
          </h3>
        </div>
      </div>

      <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#2b2112]">
              Customer Directory
            </h3>
            <p className="mt-1 text-sm text-[#7a6641]">
              Search customers by name, email, or phone.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <input
              type="text"
              placeholder="Search by name, email or phone"
              className="input-premium h-11 min-w-[280px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              type="button"
              onClick={() => loadCustomers(search)}
              className="rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                loadCustomers("");
              }}
              className="rounded-xl border border-[rgba(201,149,0,0.16)] bg-white px-5 py-3 text-sm font-semibold text-[#2b2112]"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-[rgba(201,149,0,0.12)] text-sm text-[#7a6641]">
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Contact</th>
                <th className="px-3 py-3 font-medium">Orders</th>
                <th className="px-3 py-3 font-medium">Total Spent</th>
                <th className="px-3 py-3 font-medium">Last Order</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-sm text-[#7a6641]"
                  >
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-sm text-[#7a6641]"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-[rgba(201,149,0,0.08)] text-sm text-[#2b2112]"
                  >
                    <td className="px-3 py-4">
                      <p className="font-semibold">{customer.fullName}</p>
                      <p className="mt-1 text-xs text-[#7a6641]">
                        Joined{" "}
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <p>{customer.email}</p>
                      <p className="mt-1 text-xs text-[#7a6641]">
                        {customer.phone || "No phone"}
                      </p>
                      <p className="mt-1 max-w-[260px] truncate text-xs text-[#7a6641]">
                        {customer.address || "No address"}
                      </p>
                    </td>

                    <td className="px-3 py-4 font-medium">
                      {customer.totalOrders}
                    </td>

                    <td className="px-3 py-4 font-medium">
                      ₹{customer.totalSpent.toFixed(2)}
                    </td>

                    <td className="px-3 py-4 text-[#7a6641]">
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleString()
                        : "No orders yet"}
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          customer.isActive
                            ? "bg-[#fff6df] text-[#a87400]"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {customer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}