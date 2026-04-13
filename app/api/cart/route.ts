import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();

    const cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({
        items: [],
        total: 0,
      });
    }

    const items = cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: item.product,
      subtotal: item.product.price * item.quantity,
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    return NextResponse.json({
      items,
      total,
    });
  } catch (error) {
    console.error("GET_CART_ERROR", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const productId = body.productId;

    if (!productId) {
      return NextResponse.json(
        { message: "Product id is required" },
        { status: 400 }
      );
    }

    const product = await db.product.findUnique({
      where: { id: productId },
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
        data: {
          userId: user.id,
        },
      });
    }

    const existingItem = await db.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
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
        data: {
          quantity: nextQty,
        },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: 1,
        },
      });
    }

    return NextResponse.json({ message: "Added to cart" });
  } catch (error) {
    console.error("ADD_TO_CART_ERROR", error);
    return NextResponse.json(
      { message: "Unauthorized or server error" },
      { status: 500 }
    );
  }
}