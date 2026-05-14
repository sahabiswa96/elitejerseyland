import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/order";
import {
  sendAdminOrderNotificationEmail,
  sendOrderConfirmationEmail,
} from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const customerName = body.customerName?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim();
    const address = body.address?.trim();

    if (!customerName || !phone || !email || !address) {
      return NextResponse.json(
        { message: "All checkout fields are required" },
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

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          {
            message: `${item.product.name} does not have enough stock`,
          },
          { status: 400 }
        );
      }
    }

    const total = cart.items.reduce(
      (sum: number, item: any) =>
        sum + Number(item.product.price) * item.quantity,
      0
    );

    const order = await db.customerOrder.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        customerName,
        phone,
        email,
        address,
        total,
        paymentStatus: "PENDING",
        status: "ORDERED",

        items: {
          create: cart.items.map((item: any) => ({
            productId: item.product.id,
            name: item.product.name,
            image: item.product.mainImage,
            price: Number(item.product.price),
            quantity: item.quantity,
            subtotal:
              Number(item.product.price) * item.quantity,
          })),
        },
      },

      include: {
        items: true,
      },
    });

    for (const item of cart.items) {
      await db.product.update({
        where: { id: item.product.id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    await db.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    const mailPayload = {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      phone: order.phone,
      email: order.email,
      address: order.address,
      total: Number(order.total),
      paymentStatus: order.paymentStatus,
      status: order.status,
      createdAt: order.createdAt,

      items: order.items.map((item: any) => ({
        name: item.name,
        image: item.image,
        price: Number(item.price),
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
      })),
    };

    try {
      await sendOrderConfirmationEmail(mailPayload);
      await sendAdminOrderNotificationEmail(mailPayload);
    } catch (mailError) {
      console.error("ORDER_EMAIL_ERROR", mailError);
    }

    return NextResponse.json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("CHECKOUT_ERROR", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}