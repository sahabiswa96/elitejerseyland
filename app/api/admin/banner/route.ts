import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — Fetch all banners
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error("GET_BANNERS_ERROR", error);
    return NextResponse.json(
      { message: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

// POST —  Create a new banner
export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { message: "Image URL required" },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: { imageUrl },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("CREATE_BANNER_ERROR", error);
    return NextResponse.json(
      { message: "Banner upload failed" },
      { status: 500 }
    );
  }
}

// DELETE —  Delete a banner by ID
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Banner ID required" },
        { status: 400 }
      );
    }

    await prisma.banner.delete({ where: { id } });

    return NextResponse.json({ message: "Banner deleted" });
  } catch (error) {
    console.error("DELETE_BANNER_ERROR", error);
    return NextResponse.json(
      { message: "Failed to delete banner" },
      { status: 500 }
    );
  }
}