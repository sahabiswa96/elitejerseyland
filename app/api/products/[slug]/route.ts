import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 1. Find the specific product by slug
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // 2. Find related products (Same category or team, excluding current product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        OR: [
          { category: product.category },
          ...(product.team ? [{ team: product.team }] : []),
        ],
      },
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
    });

    // 3. Return JSON response
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