import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const code = body.code?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { message: "Promo code is required" },
        { status: 400 }
      );
    }

    const promo = await db.promo.findUnique({
      where: { code },
    });

    if (!promo || !promo.isActive) {
      return NextResponse.json(
        { message: "Invalid or inactive promo code" },
        { status: 404 }
      );
    }

    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return NextResponse.json(
        { message: "Promo code has expired" },
        { status: 400 }
      );
    }

    const cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
      return NextResponse.json(
        {
          message: `Minimum order amount is ₹${promo.minOrderAmount.toFixed(2)}`,
        },
        { status: 400 }
      );
    }

    const discount =
      promo.discountType === "PERCENT"
        ? (subtotal * promo.discountValue) / 100
        : promo.discountValue;

    const finalDiscount = Math.min(discount, subtotal);
    const total = subtotal - finalDiscount;

    return NextResponse.json({
      message: "Promo applied successfully",
      promo: {
        id: promo.id,
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
      },
      subtotal,
      discount: finalDiscount,
      total,
    });
  } catch (error) {
    console.error("APPLY_PROMO_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}