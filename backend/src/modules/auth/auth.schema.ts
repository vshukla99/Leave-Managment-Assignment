import { z } from "zod";

export const RegisterSchema = z.object({
  fullName: z.string().min(3),
  mobile: z.string().min(10).max(15),
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterBody = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginBody = z.infer<typeof LoginSchema>;
