"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/lib/user";
import { RegisterSchema } from "@/schemas";

export const signup = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  const { email, password, instrument, role } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "האיימיל הזה כבר בשימוש!" };
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        instrument,
        role: role || "REGULAR", // default to REGULAR if no role specified
      },
    });
  } catch (error) {
    console.error("Failed to create user and profile:", error);
    throw error;
  }

  return { success: "המשתמש נוצר בהצלחה!" };
};
