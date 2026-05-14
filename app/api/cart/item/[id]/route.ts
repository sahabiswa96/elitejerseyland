import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const quantity = Number(body.quantity);

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { message: "Invalid quantity" },
        { status: 400 }
      );
    }

    const item = await db.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!item || item.cart.userId !== user.id) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    if (quantity > item.product.stock) {
      return NextResponse.json(
        { message: "Stock limit exceeded" },
        { status: 400 }
      );
    }

    const updated = await db.cartItem.update({
      where: { id },
      data: { quantity },
    });

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error("UPDATE_CART_ITEM_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const item = await db.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
      },
    });

    if (!item || item.cart.userId !== user.id) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    await db.cartItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Removed from cart" });
  } catch (error) {
    console.error("DELETE_CART_ITEM_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}