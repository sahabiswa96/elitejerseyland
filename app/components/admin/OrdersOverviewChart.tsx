"use client";

type MonthlyOverview = {
  month: string;
  orders: number;
  revenue: number;
};

type OrdersOverviewChartProps = {
  data: MonthlyOverview[];
};

export default function OrdersOverviewChart({
  data,
}: OrdersOverviewChartProps) {
  const maxOrders = data.length ? Math.max(...data.map((item) => item.orders), 0) : 0;

  return (
    <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#7a6641]">
            Orders Overview
          </p>
          <h3 className="mt-2 text-xl font-bold text-[#2b2112]">
            Monthly Orders & Revenue
          </h3>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[rgba(201,149,0,0.12)] bg-[#fffdf7] p-6 text-sm text-[#7a6641]">
          No monthly chart data available.
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {data.map((item) => {
            const width = maxOrders > 0 ? (item.orders / maxOrders) * 100 : 0;

            return (
              <div key={item.month}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-[#2b2112]">
                    {item.month}
                  </span>
                  <span className="text-sm text-[#7a6641]">
                    {item.orders} orders · ₹{item.revenue.toFixed(2)}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#f3eee1]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(135deg,#c99500,#e0b22c)]"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}