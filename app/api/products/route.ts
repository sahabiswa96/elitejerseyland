import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validators";

export async function GET() {
  try {
    await requireAdmin();

    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      products: products.map((product: any) => ({
        ...product,
        price: Number(product.price),
        oldPrice: product.oldPrice ? Number(product.oldPrice) : null,

        // ✅ FIX: parse JSON back to array
        sizes: product.sizes ? JSON.parse(product.sizes) : [],
        galleryImages: product.galleryImages
          ? JSON.parse(product.galleryImages)
          : [],
      })),
    });
  } catch (error) {
    console.error("ADMIN_GET_PRODUCTS_ERROR", error);

    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();

    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existing = await db.product.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 409 }
      );
    }

    const created = await db.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        category: data.category,
        subcategory: data.subcategory ?? null,
        team: data.team ?? null,
        price: data.price,
        oldPrice: data.oldPrice ?? null,
        mainImage: data.mainImage,
        stock: data.stock ?? 0,

        // ✅ FIX: store as JSON string
        sizes: JSON.stringify(data.sizes ?? []),
        galleryImages: JSON.stringify(data.galleryImages ?? []),
      },
    });

    return NextResponse.json({
      message: "Product created",
      product: {
        ...(created as any),
        price: Number(created.price),
        oldPrice: created.oldPrice ? Number(created.oldPrice) : null,

        // optional consistency fix
        sizes: created.sizes ? JSON.parse(created.sizes) : [],
        galleryImages: created.galleryImages
          ? JSON.parse(created.galleryImages)
          : [],
      },
    });
  } catch (error) {
    console.error("ADMIN_CREATE_PRODUCT_ERROR", error);

    return NextResponse.json(
      { message: "Unauthorized or server error" },
      { status: 500 }
    );
  }
}