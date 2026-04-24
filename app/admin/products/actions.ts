"use server";

import prisma from "@/lib/prisma"; // <-- এই লাইনে কার্লি ব্র্যাকেট `{ }` বাদ দেওয়া হয়েছে
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Helper function to save file to disk
async function saveFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename: timestamp-originalname.jpg
  const filename = `${Date.now()}-${file.name}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Create 'public/uploads' directory if it doesn't exist
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filepath = path.join(uploadDir, filename);
  
  // Write file to disk
  await writeFile(filepath, buffer);
  
  // Return the path to store in DB (e.g., /uploads/123456-image.jpg)
  return `/uploads/${filename}`;
}

// 1. ADD PRODUCT
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
  
  const sizesJson = formData.get("sizes") as string;
  const sizes = sizesJson ? JSON.parse(sizesJson) : [];

  // Save Main Image and get path
  const mainImageFile = formData.get("mainImage") as File;
  const mainImagePath = await saveFile(mainImageFile) || "default.jpg"; // Fallback if empty

  // Save Gallery Images
  const galleryFiles = [
    formData.get("gallery1") as File,
    formData.get("gallery2") as File,
    formData.get("gallery3") as File,
    formData.get("gallery4") as File,
  ];

  const galleryPaths: string[] = [];
  for (const file of galleryFiles) {
    const filePath = await saveFile(file);
    if (filePath) galleryPaths.push(filePath);
  }

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
        mainImage: mainImagePath,
        galleryImages: JSON.stringify(galleryPaths),
        isPublished: true,
        stock: 100, 
      },
    });

    revalidatePath("/catalog");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "Failed to add product" };
  }
}

// 2. GET ALL PRODUCTS
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// 3. DELETE PRODUCT
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

// 4. GET SINGLE PRODUCT
export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// 5. UPDATE PRODUCT
export async function updateProduct(formData: FormData) {
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
  const shortDescription = formData.get("shortDescription") as string;
  const fullDescription = formData.get("fullDescription") as string;
  
  const sizesJson = formData.get("sizes") as string;
  const sizes = sizesJson ? JSON.parse(sizesJson) : [];

  // Image Logic: Save new file if uploaded, otherwise keep existing path
  const mainImageFile = formData.get("mainImage") as File;
  const existingMainImage = formData.get("existingMainImage") as string;
  
  let finalMainImage = existingMainImage;
  if (mainImageFile && mainImageFile.size > 0) {
    const newPath = await saveFile(mainImageFile);
    if (newPath) finalMainImage = newPath;
  }

  // Gallery Logic
  const existingGalleryJson = formData.get("existingGallery") as string;
  const existingGallery = existingGalleryJson ? JSON.parse(existingGalleryJson) : ["", "", "", ""];

  const getFinalImage = async (newFile: File, existing: string, index: number) => {
    if (newFile && newFile.size > 0) {
      const imgPath = await saveFile(newFile);
      return imgPath || existing;
    }
    return existing;
  };

  const g1 = await getFinalImage(formData.get("gallery1") as File, existingGallery[0], 0);
  const g2 = await getFinalImage(formData.get("gallery2") as File, existingGallery[1], 1);
  const g3 = await getFinalImage(formData.get("gallery3") as File, existingGallery[2], 2);
  const g4 = await getFinalImage(formData.get("gallery4") as File, existingGallery[3], 3);

  const finalGallery = [g1, g2, g3, g4].filter(img => img && img.length > 0);

  try {
    await prisma.product.update({
      where: { id },
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
        mainImage: finalMainImage,
        galleryImages: JSON.stringify(finalGallery),
      },
    });

    revalidatePath("/catalog");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}