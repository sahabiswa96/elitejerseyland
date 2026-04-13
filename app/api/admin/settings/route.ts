import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    let settings = await db.setting.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!settings) {
      settings = await db.setting.create({
        data: {
          storeName: "Elite Jersey Land",
          supportEmail: "support@elitejerseyland.com",
          supportPhone: "",
          address: "",
          logo: "",
          currency: "INR",
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("ADMIN_GET_SETTINGS_ERROR", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();

    let settings = await db.setting.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!settings) {
      settings = await db.setting.create({
        data: {},
      });
    }

    const updated = await db.setting.update({
      where: { id: settings.id },
      data: {
        storeName: body.storeName ?? settings.storeName,
        supportEmail: body.supportEmail ?? settings.supportEmail,
        supportPhone: body.supportPhone ?? settings.supportPhone,
        address: body.address ?? settings.address,
        logo: body.logo ?? settings.logo,
        currency: body.currency ?? settings.currency,
      },
    });

    return NextResponse.json({
      message: "Settings updated successfully",
      settings: updated,
    });
  } catch (error) {
    console.error("ADMIN_UPDATE_SETTINGS_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}