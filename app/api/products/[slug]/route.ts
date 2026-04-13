import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;

    const product = await db.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const relatedProducts = await db.product.findMany({
      where: {
        id: { not: product.id },
        OR: [
          { category: product.category },
          ...(product.subcategory ? [{ subcategory: product.subcategory }] : []),
          ...(product.team ? [{ team: product.team }] : []),
        ],
      },
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      product: {
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      },
      relatedProducts: relatedProducts.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET_PRODUCT_BY_SLUG_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}