import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUserFromCookie();

    if (!user || user.role !== "CUSTOMER") {
      return NextResponse.json({ count: 0 });
    }

    const cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return NextResponse.json({ count: 0 });
    }

    const count = cart.items.reduce(
  (sum: number, item: any) => sum + item.quantity,
  0
);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("GET_CART_COUNT_ERROR", error);
    return NextResponse.json({ count: 0 });
  }
}