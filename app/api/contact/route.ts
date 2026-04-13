import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendContactEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim() || null;
    const houseName = body.houseName?.trim() || null;
    const roadName = body.roadName?.trim() || null;
    const address = body.address?.trim() || null;
    const pincode = body.pincode?.trim() || null;

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    const contact = await db.contactMessage.create({
      data: {
        name,
        email,
        phone,
        houseName,
        roadName,
        address,
        pincode,
      },
    });

    await sendContactEmail({
      name,
      email,
      phone,
      houseName,
      roadName,
      address,
      pincode,
    });

    return NextResponse.json({
      message: "Contact request submitted successfully",
      contact,
    });
  } catch (error) {
    console.error("CONTACT_SUBMIT_ERROR", error);
    return NextResponse.json(
      { message: "Failed to send contact request" },
      { status: 500 }
    );
  }
}