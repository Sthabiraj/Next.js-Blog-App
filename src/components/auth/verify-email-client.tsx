"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import { resendVerificationEmail } from "@/lib/actions";

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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const searchParams = useSearchParams();

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Retrieve stored verification status
    const storedStatus = sessionStorage.getItem("verificationStatus");
    if (storedStatus) {
      setVerificationStatus(storedStatus as VerificationStatusType);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setTimeout(() => setCooldownTime((time) => time - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldownTime]);

  const verifyEmail = useCallback(async (token: string) => {
    try {
      const response = await fetch(`/api/verify-email?token=${token}`);
      const data = await response.json();

      if (data.success) {
        setVerificationStatus(VerificationStatus.SUCCESS);
        if (data.email) setUserEmail(data.email);
        // Store the successful verification status
        sessionStorage.setItem(
          "verificationStatus",
          VerificationStatus.SUCCESS
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus(VerificationStatus.ERROR);
      // Store the error status
      sessionStorage.setItem("verificationStatus", VerificationStatus.ERROR);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = searchParams.get("token");
      const storedStatus = sessionStorage.getItem("verificationStatus");

      if (token && !storedStatus) {
        verifyEmail(token);
      } else if (storedStatus) {
        setVerificationStatus(storedStatus as VerificationStatusType);
      } else {
        setVerificationStatus(VerificationStatus.AWAITING);
        const email = searchParams.get("email");
        if (email) {
          setUserEmail(email);
          localStorage.setItem("email", email);
        }
      }
    }
  }, [searchParams, verifyEmail, isClient]);

  const handleResendEmail = async () => {
    if (cooldownTime > 0) return;

    setIsResending(true);
    try {
      if (!userEmail) {
        toast.error("Email address not available. Please contact support.");
        return;
      }

      const result = await resendVerificationEmail(userEmail);
      if (result.success) {
        toast.success("Verification email resent. Please check your inbox.");
        setCooldownTime(60);
        // Reset the verification status to awaiting
        setVerificationStatus(VerificationStatus.AWAITING);
        sessionStorage.setItem(
          "verificationStatus",
          VerificationStatus.AWAITING
        );
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

  if (!isClient) {
    return null; // or a loading spinner
  }

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
              disabled={isResending || cooldownTime > 0}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : cooldownTime > 0 ? (
                `Resend in ${cooldownTime}s`
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
              onClick={() => router.push("/upload-picture")}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Go to Next Step
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
