import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validators";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;

    const product = await db.product.findUnique({
      where: { id },
      include: { sizes: true },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      product: {
        ...product,
        price: Number(product.price),
        oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
        sizes: product.sizes.map((s) => s.size),
      },
    });
  } catch (error) {
    console.error("ADMIN_GET_PRODUCT_ERROR", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existing = await db.product.findFirst({
      where: {
        slug: data.slug,
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Slug already used by another product" },
        { status: 409 }
      );
    }

    await db.productSize.deleteMany({
      where: { productId: id },
    });

    const updated = await db.product.update({
      where: { id },
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
      message: "Product updated",
      product: {
        ...updated,
        price: Number(updated.price),
        oldPrice: updated.oldPrice ? Number(updated.oldPrice) : null,
        sizes: updated.sizes.map((s) => s.size),
      },
    });
  } catch (error) {
    console.error("ADMIN_UPDATE_PRODUCT_ERROR", error);
    return NextResponse.json({ message: "Unauthorized or server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;

    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("ADMIN_DELETE_PRODUCT_ERROR", error);
    return NextResponse.json({ message: "Unauthorized or server error" }, { status: 500 });
  }
}