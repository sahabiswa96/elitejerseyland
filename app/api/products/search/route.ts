import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q) {
      return NextResponse.json({ products: [] });
    }

    const products = await db.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { subcategory: { contains: q, mode: "insensitive" } },
          { team: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        mainImage: true,
        category: true,
        team: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("PRODUCT_SEARCH_ERROR", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}