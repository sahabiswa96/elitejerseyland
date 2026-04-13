import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const updated = await db.promo.update({
      where: { id },
      data: {
        code: body.code ? String(body.code).trim().toUpperCase() : undefined,
        discountType: body.discountType || undefined,
        discountValue:
          body.discountValue !== undefined
            ? Number(body.discountValue)
            : undefined,
        minOrderAmount:
          body.minOrderAmount !== undefined && body.minOrderAmount !== ""
            ? Number(body.minOrderAmount)
            : body.minOrderAmount === ""
            ? null
            : undefined,
        isActive:
          body.isActive !== undefined ? Boolean(body.isActive) : undefined,
        expiresAt:
          body.expiresAt !== undefined
            ? body.expiresAt
              ? new Date(body.expiresAt)
              : null
            : undefined,
      },
    });

    return NextResponse.json({
      message: "Promo updated successfully",
      promo: updated,
    });
  } catch (error) {
    console.error("ADMIN_UPDATE_PROMO_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;

    await db.promo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Promo deleted successfully" });
  } catch (error) {
    console.error("ADMIN_DELETE_PROMO_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}