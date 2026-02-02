import { z } from "zod";

/**
 * ================================
 * USER: Update own profile
 * ================================
 */
export const updateMyProfileSchema = z
  .object({
    fullName: z.string().min(2).optional(),
    mobile: z.string().min(8).max(15).optional(),
  })
  .strict();

/**
 * ================================
 * ADMIN: Update user
 * ================================
 */
export const updateUserSchema = z
  .object({
    fullName: z.string().min(2).optional(),
    mobile: z.string().min(8).max(15).optional(),
    email: z.string().email().optional(),
    role: z.enum(["USER", "ADMIN"]).optional(),
  })
  .strict();
