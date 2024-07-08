import VerifyEmailClient from "@/components/auth/verify-email-client";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Verify your email address to access all features of your account.",
};

export default async function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
