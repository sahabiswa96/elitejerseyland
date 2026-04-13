import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const paymentStatus = searchParams.get("paymentStatus")?.trim() || "";

    const orders = await db.customerOrder.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  {
                    orderNumber: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    customerName: {
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
            : {},
          status
            ? {
                status: status as
                  | "ORDERED"
                  | "PACKED"
                  | "SHIPPED"
                  | "DELIVERED"
                  | "CANCELLED",
              }
            : {},
          paymentStatus
            ? {
                paymentStatus: paymentStatus as
                  | "UNPAID"
                  | "PENDING"
                  | "PAID"
                  | "FAILED",
              }
            : {},
        ],
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("ADMIN_GET_ORDERS_ERROR", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}