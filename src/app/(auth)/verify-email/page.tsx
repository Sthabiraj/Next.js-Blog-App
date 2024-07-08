import VerifyEmailClient from "@/components/auth/verify-email-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Verify your email address to access all features of your account.",
};

export default async function VerifyEmailPage() {
  return <VerifyEmailClient />;
}
