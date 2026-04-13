import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";

    const users = await db.user.findMany({
      where: {
        role: "CUSTOMER",
        ...(search
          ? {
              OR: [
                {
                  firstName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  phone: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        orders: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const customers = users.map((user) => {
      const totalOrders = user.orders.length;
      const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);
      const lastOrderDate = user.orders[0]?.createdAt || null;

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isActive: user.isActive,
        createdAt: user.createdAt,
        totalOrders,
        totalSpent,
        lastOrderDate,
      };
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("ADMIN_GET_CUSTOMERS_ERROR", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}