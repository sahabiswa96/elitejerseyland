import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validators";

type Params = {
  params: Promise<{ id: string }>;
};


/**
 * GET SINGLE PRODUCT
 */
export async function GET(_: Request, { params }: Params) {
  try {
    await requireAdmin();

    const { id } = await params;

    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product: {
        ...product,
        price: Number(product.price),
        oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
      },
    });

  } catch (error) {
    console.error("ADMIN_GET_PRODUCT_ERROR", error);

    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}


/**
 * UPDATE PRODUCT
 */
export async function PUT(req: Request, { params }: Params) {
  try {
    await requireAdmin();

    const { id } = await params;

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

    // check duplicate name (instead of slug)
    const existing = await db.product.findFirst({
      where: {
        name: data.name,
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Another product with same name exists" },
        { status: 409 }
      );
    }

    const updated = await db.product.update({
      where: { id },
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
      },
    });

    return NextResponse.json({
      message: "Product updated",
      product: {
        ...updated,
        price: Number(updated.price),
        oldPrice: updated.oldPrice ? Number(updated.oldPrice) : null,
      },
    });

  } catch (error) {
    console.error("ADMIN_UPDATE_PRODUCT_ERROR", error);

    return NextResponse.json(
      { message: "Unauthorized or server error" },
      { status: 500 }
    );
  }
}


/**
 * DELETE PRODUCT
 */
export async function DELETE(_: Request, { params }: Params) {
  try {
    await requireAdmin();

    const { id } = await params;

    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("ADMIN_DELETE_PRODUCT_ERROR", error);

    return NextResponse.json(
      { message: "Unauthorized or server error" },
      { status: 500 }
    );
  }
}