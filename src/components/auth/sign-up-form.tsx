"use client";

import { signUp, SignUpFormState } from "@/app/actions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const initialState: SignUpFormState = {
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
      Sign Up
    </Button>
  );
}

export default function SignUpForm() {
  const [state, formAction] = useFormState(signUp, initialState);
  const ref = useRef<HTMLFormElement>(null);

  if (state.success) {
    ref.current?.reset();
    toast.success("Account created successfully");
    redirect("/verify-email");
  }

  if (state.errors.general) {
    toast.error(state.errors.general);
  }

  return (
    <form ref={ref} action={formAction} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          required
        />
        {state.errors.name && (
          <p className="text-red-500 text-sm">{state.errors.name}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
        {state.errors.email && (
          <p className="text-red-500 text-sm">{state.errors.email}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
        />
        {state.errors.password && (
          <p className="text-red-500 text-sm">{state.errors.password}</p>
        )}
      </div>
      {state.errors.general && (
        <p className="text-red-500 text-sm">{state.errors.general}</p>
      )}
      <SubmitButton />
    </form>
  );
}
