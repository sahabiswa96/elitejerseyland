import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "elite_secret_key";

type TokenUser = {
  id: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  firstName: string;
  lastName: string;
};

function verify(token?: string): TokenUser | null {
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as TokenUser;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const token = req.cookies.get("elj_auth")?.value;
  const user = verify(token);

  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminPublic = pathname === "/admin" || pathname === "/admin/login";

  const isProtectedCustomerRoute =
    pathname.startsWith("/account") ||
    pathname === "/cart" ||
    pathname === "/checkout";

  if (isAdminRoute && !isAdminPublic) {
    if (!user || user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  if (isProtectedCustomerRoute) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if ((pathname === "/login" || pathname === "/signup") && user) {
    if (user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.redirect(new URL("/", req.url));
  }

  if ((pathname === "/admin" || pathname === "/admin/login") && user?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/cart",
    "/checkout",
    "/login",
    "/signup",
  ],
};