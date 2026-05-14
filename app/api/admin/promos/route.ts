import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const promos = await db.promo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ promos });
  } catch (error) {
    console.error("ADMIN_GET_PROMOS_ERROR", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const code = body.code?.trim().toUpperCase();
    const discountType = body.discountType;
    const discountValue = Number(body.discountValue);
    const minOrderAmount = body.minOrderAmount
      ? Number(body.minOrderAmount)
      : null;
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

    if (!code || !discountType || !discountValue) {
      return NextResponse.json(
        { message: "Code, discount type and discount value are required" },
        { status: 400 }
      );
    }

    if (!["FIXED", "PERCENT"].includes(discountType)) {
      return NextResponse.json(
        { message: "Invalid discount type" },
        { status: 400 }
      );
    }

    const existing = await db.promo.findUnique({
      where: { code },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Promo code already exists" },
        { status: 409 }
      );
    }

    const promo = await db.promo.create({
      data: {
        code,
        discountType,
        discountValue,
        minOrderAmount,
        expiresAt,
        isActive: true,
      },
    });

    return NextResponse.json({
      message: "Promo created successfully",
      promo,
    });
  } catch (error) {
    console.error("ADMIN_CREATE_PROMO_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}