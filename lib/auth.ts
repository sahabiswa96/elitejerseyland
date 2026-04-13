import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "elite_secret_key";

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(user: SessionUser) {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export async function setAuthCookie(user: SessionUser) {
  const token = signToken(user);
  const cookieStore = await cookies();

  cookieStore.set("elj_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.set("elj_auth", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
}

export async function getCurrentUserFromCookie(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("elj_auth")?.value;

  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth() {
  const user = await getCurrentUserFromCookie();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return user;
}