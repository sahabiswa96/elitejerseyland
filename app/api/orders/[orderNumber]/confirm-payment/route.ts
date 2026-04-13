// elite-jersey-land/app/api/orders/[orderNumber]/confirm-payment/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = {
  params: Promise<{ orderNumber: string }>;
};

export async function POST(_: Request, { params }: Params) {
  try {
    const { orderNumber } = await params;

    const order = await db.customerOrder.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { message: "Payment already confirmed" },
        { status: 400 }
      );
    }

    await db.customerOrder.update({
      where: { orderNumber },
      data: { paymentStatus: "PAID" },
    });

    return NextResponse.json({ message: "Payment confirmed" });
  } catch (error) {
    console.error("CONFIRM_PAYMENT_ERROR", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}