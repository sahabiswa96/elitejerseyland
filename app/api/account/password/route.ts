import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    // ইউজার লগইন আছে কি না চেক করা হচ্ছে
    const user = await requireAuth();

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // ভ্যালিডেশন
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current and new passwords are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // ডাটাবেস থেকে ইউজারের বর্তমান পাসওয়ার্ড হ্যাশ আনা হচ্ছে
    const existingUser = await db.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return NextResponse.json(
        { message: "User data not found" },
        { status: 404 }
      );
    }

    // ইউজার যে পাসওয়ার্ড দিছে সেটা ডাটাবেসের সাথে মেটাচ্ছে কি না চেক করা হচ্ছে
    const isMatch = await bcrypt.compare(currentPassword, existingUser.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect current password" },
        { status: 401 }
      );
    }

    // নতুন পাসওয়ার্ড হ্যাশ করা হচ্ছে
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // ডাটাবেসে নতুন পাসওয়ার্ড আপডেট করা হচ্ছে
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedNewPassword },
    });

    return NextResponse.json(
      { message: "Password updated successfully" }
    );
  } catch (error) {
    console.error("CHANGE_PASSWORD_ERROR", error);
    
    // requireAuth() থেকে আনঅথোরাইজড এরর হ্যান্ডেল করা হচ্ছে
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Failed to update password" },
      { status: 500 }
    );
  }
}