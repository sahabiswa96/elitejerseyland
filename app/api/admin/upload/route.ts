import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // শুধু ছবি ফাইল আপলোড হবে
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // ৫MB লিমিট
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size must be under 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".png";
    const filename = `banner-${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "banners");

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    const imageUrl = `/uploads/banners/${filename}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("UPLOAD_ERROR", error);
    return NextResponse.json(
      { message: "Upload failed" },
      { status: 500 }
    );
  }
}