import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validators";

export async function GET() {
  try {
    await requireAdmin();

    const products = await db.product.findMany({
      include: { sizes: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      products: products.map((product) => ({
        ...product,
        price: Number(product.price),
        oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
        sizes: product.sizes.map((s) => s.size),
      })),
    });
  } catch (error) {
    console.error("ADMIN_GET_PRODUCTS_ERROR", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existing = await db.product.findUnique({
      where: { slug: data.slug },
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
        brand: data.brand ?? null,
        team: data.team ?? null,
        quality: data.quality ?? null,
        category: data.category,
        subcategory: data.subcategory ?? null,
        price: data.price,
        oldPrice: data.oldPrice ?? null,
        stockStatus: data.stockStatus ?? null,
        shortDescription: data.shortDescription ?? null,
        description: data.description ?? null,
        mainImage: data.mainImage,
        galleryImage1: data.galleryImage1 ?? null,
        galleryImage2: data.galleryImage2 ?? null,
        galleryImage3: data.galleryImage3 ?? null,
        galleryImage4: data.galleryImage4 ?? null,
        stock: data.stock,
        sizes: {
          create: (data.sizes || []).map((size) => ({ size })),
        },
      },
      include: { sizes: true },
    });

    return NextResponse.json({
      message: "Product created",
      product: {
        ...created,
        price: Number(created.price),
        oldPrice: created.oldPrice ? Number(created.oldPrice) : null,
        sizes: created.sizes.map((s) => s.size),
      },
    });
  } catch (error) {
    console.error("ADMIN_CREATE_PRODUCT_ERROR", error);
    return NextResponse.json({ message: "Unauthorized or server error" }, { status: 500 });
  }
}