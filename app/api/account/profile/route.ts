import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();

    const profile = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("GET_PROFILE_ERROR", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const phone = body.phone?.trim();
    const address = body.address?.trim();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { message: "First name and last name are required" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { message: "Phone is required" },
        { status: 400 }
      );
    }

    const phoneExists = await db.user.findFirst({
      where: {
        phone,
        NOT: { id: user.id },
      },
      select: { id: true },
    });

    if (phoneExists) {
      return NextResponse.json(
        { message: "Phone number already used by another account" },
        { status: 409 }
      );
    }

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        phone,
        address: address || null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updated,
    });
  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}