"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import axios, { AxiosError } from "axios";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

// Define the schema for signup validation
const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Define the type for the form state
export type SignUpFormState = {
  errors: {
    name?: string[];
    email?: string[];
    password?: string[];
    general?: string[];
  };
  success: boolean;
  values?: {
    name: string;
    email: string;
    password: string;
  };
};

// Helper function to create a consistent error response
const createErrorResponse = (
  errors: Partial<SignUpFormState["errors"]>
): SignUpFormState => ({
  errors,
  success: false,
});

// Helper function to create a success response
const createSuccessResponse = (values: {
  name: string;
  email: string;
  password: string;
}): SignUpFormState => ({
  errors: {},
  success: true,
  values: values,
});

// Main signup function
export async function signUp(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  // Validate input fields
  const validatedFields = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // Return early if validation fails
  if (!validatedFields.success) {
    return createErrorResponse(validatedFields.error.flatten().fieldErrors);
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return createErrorResponse({
        email: ["This email is already registered"],
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Send verification email
    const emailResult = await resendVerificationEmail(email);
    if (!emailResult.success) {
      // Consider deleting the user if email verification fails
      await prisma.user.delete({ where: { id: newUser.id } });
      return createErrorResponse({
        general: [emailResult.error || "Failed to send verification email"],
      });
    }

    return createSuccessResponse({ name, email, password });
  } catch (error) {
    console.error("Signup error:", error);
    return createErrorResponse({
      general: ["An error occurred. Please try again later."],
    });
  }
}

export interface VerificationEmail {
  error?: string;
  success: boolean;
}

export async function resendVerificationEmail(
  email: string
): Promise<VerificationEmail> {
  try {
    // base url
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
    }

    const response = await axios.post<{ success: true }>(
      `${baseUrl}/api/send-verification-email`,
      { email },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Email API Response:", response.data);

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      return {
        success: false,
        error:
          axiosError.response?.data.message ||
          axiosError.message ||
          "Failed to resend verification email",
      };
    } else {
      return {
        success: false,
        error:
          "An unexpected error occurred while sending the verification email",
      };
    }
  }
}

// Define a schema for input validation
const credentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Define the shape of the form state
type FormState = {
  message: string | null;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export async function authenticate(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Validate and sanitize the input
  const validatedFields = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If form validation fails, return error messages
  if (!validatedFields.success) {
    return {
      message: "Invalid input. Please check your email and password.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await signIn("credentials", {
      ...validatedFields.data,
      redirect: false,
    });

    if (result?.error) {
      return { message: "Invalid credentials." };
    }

    // Redirect to home on success
    redirect("/");
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid credentials." };
        case "CallbackRouteError":
          return {
            message:
              "There was a problem with the sign-in link. Please try again.",
          };
        default:
          return { message: "An unexpected error occurred. Please try again." };
      }
    }
    // Log unexpected errors
    console.error("Authentication error:", error);
    return { message: "An unexpected error occurred. Please try again." };
  }
}

export async function signInWithGitHub(): Promise<FormState> {
  try {
    await signIn("github", { callbackUrl: "/" });
    return { message: null }; // This line will likely never be reached due to the redirect
  } catch (error) {
    console.error("GitHub sign-in error:", error);
    return { message: "Failed to sign in with GitHub. Please try again." };
  }
}
