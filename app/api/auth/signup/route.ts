import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { signupSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    console.log("POST /api/auth/signup HIT");

    const body = await req.json();
    console.log("SIGNUP BODY:", body);

    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      console.log("SIGNUP VALIDATION FAILED", parsed.error.flatten());
      return NextResponse.json(
        { message: "Validation failed" },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, address, password } = parsed.data;

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      console.log("SIGNUP DUPLICATE USER");
      return NextResponse.json(
        { message: "Email or phone already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        passwordHash,
        role: "CUSTOMER",
        isActive: true,
      },
    });

    console.log("SIGNUP USER CREATED:", user.email);

    return NextResponse.json({
      message: "Signup successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("SIGNUP_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}