import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address",
};

export default function VerifyEmail() {
  return (
    <div className="h-full w-full flex justify-center items-center bg-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We have sent you an email with a verification link. Please check
            your inbox and click on the link to verify your email.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Image
            src="verify-email.svg"
            alt="verify email"
            width={200}
            height={200}
          />
        </CardContent>
        <CardFooter>
          <CardDescription>
            Didn't receive the email?{" "}
            <a
              href="#"
              className={cn(buttonVariants({ variant: "link" }), "p-0")}
            >
              Resend Email
            </a>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
