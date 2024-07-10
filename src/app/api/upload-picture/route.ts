import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, image } = await req.json();

    if (!email || !image) {
      return NextResponse.json(
        { error: "Email and image are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Save the image to the database
    await prisma.user.update({
      where: { email },
      data: { image },
    });

    return NextResponse.json({
      success: true,
      message: `Image uploaded for ${email}`,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
