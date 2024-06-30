import Authentication from "@/components/auth/authentication";
import { SignUpForm } from "@/components/forms/sign-up-form";

export default function SignUpPage() {
  return (
    <Authentication signInOrSignUp="sign-up" formElement={<SignUpForm />} />
  );
}
