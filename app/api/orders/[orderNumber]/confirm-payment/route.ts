import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

type Params = {
  params: Promise<{ orderNumber: string }>;
};

export async function POST(req: Request, { params }: Params) {
  try {
    const { orderNumber } = await params;
    
    // FormData হিসেবে ডাটা রিসিভ করা হচ্ছে (ছবি আপলোডের জন্য)
    const formData = await req.formData();
    const utr = formData.get("utr") as string | null;
    const file = formData.get("screenshot") as File | null;

    // ভ্যালিডেশন: UTR বা ছবি দুটোর একটা অবশ্যই দিতে হবে
    if ((!utr || utr.trim().length < 12) && (!file || file.size === 0)) {
      return NextResponse.json(
        { message: "Please provide a valid 12-digit UTR or upload a payment screenshot." },
        { status: 400 }
      );
    }

    // অর্ডার চেক করা
    const order = await db.customerOrder.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ message: "Payment already verified" }, { status: 400 });
    }

    let screenshotUrl: string | null = null;

    // যদি ছবি দেয়, সেটা সার্ভারে সেভ করা হচ্ছে
    if (file && file.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ message: "Only JPG, PNG, or WebP images are allowed." }, { status: 400 });
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ message: "Image size must be under 5MB." }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `proof-${orderNumber}-${Date.now()}.webp`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "payments");

      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      
      screenshotUrl = `/uploads/payments/${filename}`;
    }

    // ডাটাবেস আপডেট (PENDING রাখা হচ্ছে, অ্যাডমিন ভেরিফাই করবে)
    await db.customerOrder.update({
      where: { orderNumber },
      data: {
        utr: utr?.trim() || null,
        paymentScreenshot: screenshotUrl,
        paymentStatus: "PENDING", 
      },
    });

    return NextResponse.json({ 
      message: "Payment proof submitted successfully. Admin will verify it shortly." 
    });

  } catch (error) {
    console.error("CONFIRM_PAYMENT_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}