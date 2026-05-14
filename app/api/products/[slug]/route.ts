import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Find product
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Find related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: {
          not: product.id,
        },

        OR: [
          {
            category: product.category,
          },

          ...(product.team
            ? [
                {
                  team: product.team,
                },
              ]
            : []),
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
        price: Number(product.price),
        oldPrice: product.oldPrice
          ? Number(product.oldPrice)
          : null,

        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      },

      relatedProducts: relatedProducts.map((item: any) => ({
        ...item,

        price: Number(item.price),
        oldPrice: item.oldPrice
          ? Number(item.oldPrice)
          : null,

        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    });

  } catch (error) {
    console.error("GET_PRODUCT_BY_SLUG_ERROR", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}