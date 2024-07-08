"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import { resendVerificationEmail } from "@/app/actions";

const VerificationStatus = {
  PENDING: "pending",
  SUCCESS: "success",
  ERROR: "error",
  AWAITING: "awaiting_verification",
} as const;

type VerificationStatusType =
  (typeof VerificationStatus)[keyof typeof VerificationStatus];

const StatusContent = {
  [VerificationStatus.PENDING]: {
    icon: <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />,
    title: "Verifying Your Email",
    message: "Please wait while we confirm your email address...",
  },
  [VerificationStatus.AWAITING]: {
    icon: <Mail className="h-12 w-12 text-blue-500" />,
    title: "Email Verification Required",
    message:
      "Please check your email for a verification link. Click the link to verify your email address.",
  },
  [VerificationStatus.SUCCESS]: {
    icon: <CheckCircle className="h-12 w-12 text-green-500" />,
    title: "Email Verified!",
    message:
      "Thank you for verifying your email address. You can now access all features of your account.",
  },
  [VerificationStatus.ERROR]: {
    icon: <XCircle className="h-12 w-12 text-red-500" />,
    title: "Verification Failed",
    message:
      "We encountered an issue while verifying your email. This could be due to an expired or invalid link.",
  },
};

export default function VerifyEmailClient() {
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatusType>(VerificationStatus.PENDING);
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();

  const verifyEmail = useCallback(async (token: string) => {
    try {
      const response = await fetch(`/api/verify-email?token=${token}`);
      const data = await response.json();

      if (data.success) {
        setVerificationStatus(VerificationStatus.SUCCESS);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus(VerificationStatus.ERROR);
    }
  }, []);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyEmail(token);
    } else {
      setVerificationStatus(VerificationStatus.AWAITING);
    }
  }, [searchParams, verifyEmail]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) throw new Error("Email not found");

      const result = await resendVerificationEmail(email);
      if (result.success) {
        toast.success("Verification email resent. Please check your inbox.");
      } else {
        throw new Error(result.error || "Failed to resend email");
      }
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const { icon, title, message } = StatusContent[verificationStatus];

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-r from-blue-100 to-purple-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-6 px-8">
          <div className="flex flex-col items-center text-center space-y-4">
            {icon}
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-6 px-8">
          {(verificationStatus === VerificationStatus.ERROR ||
            verificationStatus === VerificationStatus.AWAITING) && (
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>
          )}
          {verificationStatus === VerificationStatus.SUCCESS && (
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Go to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
