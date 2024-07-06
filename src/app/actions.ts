"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

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
};

// Helper function to create a consistent error response
const createErrorResponse = (
  errors: Partial<SignUpFormState["errors"]>
): SignUpFormState => ({
  errors,
  success: false,
});

// Helper function to create a success response
const createSuccessResponse = (): SignUpFormState => ({
  errors: {},
  success: true,
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
    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return createSuccessResponse();
  } catch (error) {
    console.error("Signup error:", error);
    return createErrorResponse({
      general: ["An error occurred. Please try again later."],
    });
  }
}
