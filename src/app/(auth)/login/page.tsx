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
import { LogIn } from "lucide-react";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your account to access your personal dashboard.",
};

export default function Login() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-r from-blue-100 to-purple-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <LogIn className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">
            Log in to your account to access your personal dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <LoginForm />
        </CardContent>
        <CardFooter className="flex justify-center pb-6 px-8">
          <CardDescription>
            Don't have an account?{" "}
            <Link
              href="sign-up"
              className={cn(
                buttonVariants({ variant: "link" }),
                "p-0 text-blue-500 hover:text-blue-600"
              )}
            >
              Sign Up
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
