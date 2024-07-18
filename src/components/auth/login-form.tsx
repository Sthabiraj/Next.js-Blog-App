"use client";

import { useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail, Lock, Github, LoaderCircle } from "lucide-react";
import { authenticate, signInWithGitHub } from "@/lib/actions";
import { toast } from "sonner";
import { useFormState } from "react-dom";
import { useMutation } from "@tanstack/react-query";

export default function LoginForm() {
  const initialState = { message: null };
  const [state, formAction] = useFormState(authenticate, initialState);

  useEffect(() => {
    if (state.message) {
      toast.error(state.message);
    }
  }, [state.message]);

  const { mutate: githubLogin, isPending: isLoadingGithub } = useMutation({
    mutationFn: signInWithGitHub,
    onError: (error) => {
      toast.error("Failed to sign in with GitHub");
      console.log("Failed to sign in with GitHub:", error.message);
    },
    onSuccess: () => {
      toast.success("Signed in with GitHub");
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-4">
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
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
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
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Sign In
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button
        type="submit"
        variant="outline"
        className="w-full bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
        onClick={() => githubLogin()}
        disabled={isLoadingGithub}
      >
        {isLoadingGithub ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Logging In...
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 mr-2"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </>
        )}
      </Button>
    </div>
  );
}
