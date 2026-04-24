"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData): Promise<void> {
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

  const shortDescription = formData.get("shortDescription") as string;
  const fullDescription = formData.get("fullDescription") as string;

  // Sizes JSON string → array
  const sizesJson = formData.get("sizes") as string;
  const sizes = sizesJson ? JSON.parse(sizesJson) : [];

  // Main image
  const mainImageFile = formData.get("mainImage") as File;
  const mainImage =
    mainImageFile && mainImageFile.size > 0 ? mainImageFile.name : "";

  // Gallery images
  const galleryFiles = [
    formData.get("gallery1") as File,
    formData.get("gallery2") as File,
    formData.get("gallery3") as File,
    formData.get("gallery4") as File,
  ];

  const galleryImages = galleryFiles
    .filter((file) => file && file.size > 0)
    .map((file) => file.name);

  try {
    await prisma.product.create({
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
        isPublished: true,
        stock: 100,
      },
    });

    // refresh catalog + admin panel
    revalidatePath("/catalog");
    revalidatePath("/admin/products");

  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product");
  }
}