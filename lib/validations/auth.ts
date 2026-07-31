/**
 * Zod validation schemas for authentication forms.
 *
 * Uses Zod v4 syntax (`z.email()`, `{ error: ... }`).
 * Password rules match the backend requirement of min 6 characters while
 * enforcing a reasonable baseline of strength on the client.
 */

import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }).trim(),
  password: z
    .string({ error: "Password is required." })
    .min(1, { error: "Password is required." }),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string({ error: "Name is required." })
      .min(2, { error: "Name must be at least 2 characters long." })
      .max(60, { error: "Name must be 60 characters or fewer." })
      .trim(),
    email: z.email({ error: "Please enter a valid email address." }).trim(),
    password: z
      .string({ error: "Password is required." })
      .min(6, { error: "Password must be at least 6 characters long." })
      .regex(/[a-zA-Z]/, { error: "Include at least one letter." })
      .regex(/[0-9]/, { error: "Include at least one number." }),
    confirmPassword: z.string({ error: "Please confirm your password." }),
    role: z.enum(["CUSTOMER", "TECHNICIAN"], {
      error: "Please select an account type.",
    }),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  });

export type RegisterValues = z.infer<typeof registerSchema>;
