import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // শুধুমাত্র অ্যাডমিন এই এপি অ্যাক্সেস করতে পারবে
    await requireAdmin();

    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "No order IDs provided" },
        { status: 400 }
      );
    }

    // সিলেক্ট করা সব অর্ডার একসাথে ডিলিট করা হচ্ছে 
    // (OrderItem গুলো ON DELETE CASCADE আছে তাই অটোমেটিক ডিলিট হয়ে যাবে)
    await db.customerOrder.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({ 
      message: `${ids.length} order(s) deleted successfully.` 
    });
  } catch (error) {
    console.error("BULK_DELETE_ORDERS_ERROR", error);
    return NextResponse.json(
      { message: "Failed to delete orders" },
      { status: 500 }
    );
  }
}