"use server";

import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpFormState = {
  errors: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  success: boolean;
};

export async function signUp(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  const validatedFields = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // try {
  //   const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

  //   const user = await prisma?.user.create({
  //     data: {
  //       name: validatedFields.data.name,
  //       email: validatedFields.data.email,
  //       password: hashedPassword,
  //     },
  //   });

  //   console.log("User created:", user?.id);
  // } catch (error) {
  //   console.error("Error creating user:", error);
  // }

  console.log("User created:", validatedFields.data);

  return {
    errors: {},
    success: true,
  };
}
