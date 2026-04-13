import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comparePassword, hashPassword, requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const currentPassword = body.currentPassword?.trim();
    const newPassword = body.newPassword?.trim();
    const confirmPassword = body.confirmPassword?.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "All password fields are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "New password and confirm password do not match" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: admin.id },
    });

    if (!user) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    const valid = await comparePassword(currentPassword, user.passwordHash);

    if (!valid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await db.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
      },
    });

    return NextResponse.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("ADMIN_CHANGE_PASSWORD_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}