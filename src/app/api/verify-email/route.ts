import { NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const decoded = verifyEmailToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { emailVerified: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to verify email:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
