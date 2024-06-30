import { Metadata } from "next";
import Authentication from "@/components/auth/authentication";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <Authentication signInOrSignUp="sign-in" formElement={<SignInPage />} />
  );
}
