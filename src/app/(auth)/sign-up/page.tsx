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
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="h-full w-full flex justify-center items-center bg-foreground">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up for Your New Account</CardTitle>
          <CardDescription>
            Join us to start your journey and unlock exclusive benefits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <CardDescription>
            Already have an account?{" "}
            <Link
              href="log-in"
              className={cn(buttonVariants({ variant: "link" }), "p-0")}
            >
              Log In
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
