"use server";

import { prisma } from "@/lib/prisma"; // Make sure you have a prisma client instance here
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
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
  
  // Sizes come from the hidden input as a JSON string
  const sizesJson = formData.get("sizes") as string;
  const sizes = sizesJson ? JSON.parse(sizesJson) : [];

  // Handle Main Image
  const mainImageFile = formData.get("mainImage") as File;
  const mainImage = mainImageFile ? mainImageFile.name : "";

  // Handle Gallery Images
  const galleryFiles = [
    formData.get("gallery1") as File,
    formData.get("gallery2") as File,
    formData.get("gallery3") as File,
    formData.get("gallery4") as File,
  ];

  // Filter out undefined or empty files and just get names
  const galleryImages = galleryFiles
    .filter((file) => file && file.size > 0)
    .map((file) => file.name);

  // --- IMPORTANT: REAL IMAGE UPLOAD LOGIC NEEDED HERE ---
  // Currently, we are only saving the filename.
  // In a real app, you would use fs.writeFileSync or a cloud service here 
  // to move the file from 'mainImageFile' to your 'public' folder.
  // ------------------------------------------------------

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
        sizes: JSON.stringify(sizes), // Store array as JSON string in DB
        mainImage,
        galleryImages: JSON.stringify(galleryImages), // Store array as JSON string
        isPublished: true,
        stock: 100, // Default stock
      },
    });

    // Clear the cache for the catalog page so new products appear immediately
    revalidatePath("/catalog");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "Failed to add product" };
  }
}