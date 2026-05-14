import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const slug = body.slug?.trim();

    if (!slug) {
      return NextResponse.json(
        { message: "Product slug is required" },
        { status: 400 }
      );
    }

    const product = await db.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock <= 0) {
      return NextResponse.json(
        { message: "Product is out of stock" },
        { status: 400 }
      );
    }

    let cart = await db.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { userId: user.id },
      });
    }

    const existingItem = await db.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id,
        },
      },
    });

    if (existingItem) {
      const nextQty = existingItem.quantity + 1;

      if (nextQty > product.stock) {
        return NextResponse.json(
          { message: "Stock limit exceeded" },
          { status: 400 }
        );
      }

      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: nextQty },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: 1,
        },
      });
    }

    return NextResponse.json({ message: "Added to cart" });
  } catch (error) {
    console.error("ADD_TO_CART_BY_SLUG_ERROR", error);
    return NextResponse.json(
      { message: "Unauthorized or server error" },
      { status: 500 }
    );
  }
}