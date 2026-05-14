"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProduct(
  formData: FormData
): Promise<void> {
  const id = formData.get("id") as string;

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const brand = formData.get("brand") as string;
  const team = formData.get("team") as string;
  const quality = formData.get("quality") as string;
  const category = formData.get("category") as string;
  const subcategory = formData.get("subcategory") as string;

  const price = parseFloat(formData.get("price") as string);

  const oldPrice = formData.get("oldPrice")
    ? parseFloat(formData.get("oldPrice") as string)
    : null;

  const shortDescription = formData.get(
    "shortDescription"
  ) as string;

  const fullDescription = formData.get(
    "fullDescription"
  ) as string;

  // Sizes
  const sizesJson = formData.get("sizes") as string;

  const sizes = sizesJson
    ? JSON.parse(sizesJson)
    : [];

  // Main image
  const mainImageFile = formData.get(
    "mainImage"
  ) as File;

  // Gallery images
  const galleryFiles = [
    formData.get("gallery1") as File,
    formData.get("gallery2") as File,
    formData.get("gallery3") as File,
    formData.get("gallery4") as File,
  ];

  try {
    // Get existing product
    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Keep old main image if no new image uploaded
    let mainImage = existingProduct.mainImage;

    if (mainImageFile && mainImageFile.size > 0) {
      mainImage = mainImageFile.name;
    }

    // Gallery images
    let galleryImages: string[] = [];

    const uploadedGalleryImages = galleryFiles
      .filter((file) => file && file.size > 0)
      .map((file) => file.name);

    if (uploadedGalleryImages.length > 0) {
      galleryImages = uploadedGalleryImages;
    } else {
      galleryImages = JSON.parse(
        existingProduct.galleryImages || "[]"
      );
    }

    await prisma.product.update({
      where: {
        id,
      },

      data: {
        name,
        slug,
        brand,
        team,
        quality,
        category,
        subcategory,
        price,
        oldPrice,
        shortDescription,
        fullDescription,
        sizes: JSON.stringify(sizes),
        mainImage,
        galleryImages: JSON.stringify(galleryImages),
      },
    });

    revalidatePath("/catalog");
    revalidatePath("/admin/products");
    revalidatePath(`/product/${slug}`);

  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}