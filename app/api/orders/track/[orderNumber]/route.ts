import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = {
  params: Promise<{ orderNumber: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const { orderNumber } = await params;

    const order = await db.customerOrder.findUnique({
      where: { orderNumber },
      select: {
        orderNumber: true,
        customerName: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("TRACK_ORDER_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}