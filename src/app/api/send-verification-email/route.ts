import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createEmailToken } from "@/lib/jwt";
import { render } from "@react-email/render";
import VerifyEmail from "@/components/templates/verify-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = createEmailToken(user.id);

    // Determine the protocol
    const proto = req.headers.get("X-Forwarded-Proto") || "http";
    // Get the host
    const host = req.headers.get("host");
    // Construct the base URL
    const baseUrl = `${proto}://${host}`;

    const verificationLink = `${baseUrl}/verify-email?token=${token}`;

    const emailHtml = render(
      VerifyEmail({
        userName: user.name || "User",
        verificationLink,
      })
    );

    await resend.emails.send({
      from: "Next.js Blog App <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email",
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: `Email sent to ${email}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
