import SignUpForm from "@/components/auth/sign-up-form";
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
import Link from "next/link";
import { UserPlus } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for your new account to unlock exclusive benefits.",
};

export default function SignUp() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-r from-blue-100 to-purple-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UserPlus className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Join us to start your journey and unlock exclusive benefits.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <SignUpForm />
        </CardContent>
        <CardFooter className="flex justify-center pb-6 px-8">
          <CardDescription>
            Already have an account?{" "}
            <Link
              href="log-in"
              className={cn(
                buttonVariants({ variant: "link" }),
                "p-0 text-blue-500 hover:text-blue-600"
              )}
            >
              Log In
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
