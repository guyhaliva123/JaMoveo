"use server";

import { AuthError } from "next-auth";
import { prisma } from "@/lib/db";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export async function login(email: string, password: string) {
  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Email does not exist!" };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return { error: "Invalid credentials!" };
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
    return { success: "Logged in successfully!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
}
