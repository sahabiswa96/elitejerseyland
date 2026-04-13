import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;

    const order = await db.customerOrder.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            address: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("ADMIN_GET_ORDER_ERROR", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await req.json();

    const data: {
      status?:
        | "ORDERED"
        | "PACKED"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED";
      paymentStatus?: "UNPAID" | "PENDING" | "PAID" | "FAILED";
    } = {};

    if (body.status) {
      data.status = body.status;
    }

    if (body.paymentStatus) {
      data.paymentStatus = body.paymentStatus;
    }

    const updated = await db.customerOrder.update({
      where: { id },
      data,
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      message: "Order updated successfully",
      order: updated,
    });
  } catch (error) {
    console.error("ADMIN_UPDATE_ORDER_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}