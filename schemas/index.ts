import * as z from "zod";
import { Instrument } from "@prisma/client";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export const RegisterSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email is required",
    })
    .transform((email) => email.toLowerCase()),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),

  instrument: z.nativeEnum(Instrument, {
    message: "Please select an instrument",
  }),
});

export type RegisterValues = z.infer<typeof RegisterSchema>;
