import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

function getMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${month} ${year}`;
}

export async function GET() {
  try {
    await requireAdmin();

    const [products, customers, orders] = await Promise.all([
      db.product.count(),
      db.user.count({
        where: {
          role: "CUSTOMER",
        },
      }),
      db.customerOrder.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: true,
        },
      }),
    ]);

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const unpaidOrders = orders.filter(
      (order) => order.paymentStatus === "UNPAID"
    ).length;
    const paidOrders = orders.filter(
      (order) => order.paymentStatus === "PAID"
    ).length;

    const recentOrders = orders.slice(0, 8).map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    }));

    const monthlyMap = new Map<
      string,
      {
        month: string;
        orders: number;
        revenue: number;
      }
    >();

    for (const order of orders) {
      const key = getMonthKey(order.createdAt);

      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          month: key,
          orders: 0,
          revenue: 0,
        });
      }

      const current = monthlyMap.get(key)!;
      current.orders += 1;
      current.revenue += order.total;
    }

    const monthlyOverview = Array.from(monthlyMap.values()).slice(-6);

    return NextResponse.json({
      stats: {
        totalProducts: products,
        totalCustomers: customers,
        totalOrders,
        totalRevenue,
        unpaidOrders,
        paidOrders,
      },
      recentOrders,
      monthlyOverview,
    });
  } catch (error) {
    console.error("ADMIN_DASHBOARD_ERROR", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}