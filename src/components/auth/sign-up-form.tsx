"use client";

import { signUp, SignUpFormState } from "@/app/actions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { LoaderCircle, Mail, Lock, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialState: SignUpFormState = {
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
      disabled={pending}
    >
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Signing Up...
        </>
      ) : (
        "Sign Up"
      )}
    </Button>
  );
}

export default function SignUpForm() {
  const [state, formAction] = useFormState(signUp, initialState);
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      ref.current?.reset();
      toast.success("Account created successfully");
      router.push("/verify-email");
    }
    if (state.errors.general) {
      toast.error(state.errors.general);
    }
  }, [state, router]);

  return (
    <form ref={ref} action={formAction} className="flex flex-col gap-4">
      <div className="space-y-1">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Name
        </Label>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            required
            className={`pl-10 ${state.errors.name ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
          />
        </div>
        {state.errors.name && (
          <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            className={`pl-10 ${state.errors.email ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
          />
        </div>
        {state.errors.email && (
          <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            className={`pl-10 ${state.errors.password ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
          />
        </div>
        {state.errors.password && (
          <p className="text-red-500 text-xs mt-1">{state.errors.password}</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
