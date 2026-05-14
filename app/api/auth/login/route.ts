import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comparePassword, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    console.log("POST /api/auth/login HIT");

    const body = await req.json();
    console.log("LOGIN BODY:", body);

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      console.log("LOGIN VALIDATION FAILED", parsed.error.flatten());
      return NextResponse.json(
        { message: "Validation failed" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("LOGIN USER NOT FOUND");
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, user.passwordHash);

    if (!valid) {
      console.log("LOGIN PASSWORD INVALID");
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    await setAuthCookie({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    console.log("LOGIN SUCCESS:", user.email);

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}