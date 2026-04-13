import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category") || "";
    const subcategory = searchParams.get("subcategory") || "";

    const products = await db.product.findMany({
      where: {
        AND: [
          category
            ? {
                category: {
                  equals: category,
                  mode: "insensitive",
                },
              }
            : {},
          subcategory
            ? {
                subcategory: {
                  equals: subcategory,
                  mode: "insensitive",
                },
              }
            : {},
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      products: products.map((product) => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}