import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        imageUrl: true,
      },
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error("BANNER_API_ERROR", error);

    return NextResponse.json(
      { message: "Failed to load banners" },
      { status: 500 }
    );
  }
}