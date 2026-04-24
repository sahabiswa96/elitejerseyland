import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderNumber } = await req.json();

    if (!orderNumber) {
      return NextResponse.json(
        { message: "Order number is required" },
        { status: 400 }
      );
    }

    const order = await prisma.customerOrder.findUnique({
      where: {
        orderNumber: orderNumber.trim().toUpperCase(),
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found. Please check your order number." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("TRACK_ORDER_ERROR:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}