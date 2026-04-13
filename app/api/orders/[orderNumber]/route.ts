import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

type Params = {
  params: Promise<{ orderNumber: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    const { orderNumber } = await params;

    const order = await db.customerOrder.findUnique({
      where: { orderNumber },
      include: {
        items: true,
      },
    });

    if (!order || order.userId !== user.id) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("GET_ORDER_DETAILS_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}