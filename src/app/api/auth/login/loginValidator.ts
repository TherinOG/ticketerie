import { z } from 'zod';

export const loginValidator = z.object({
  email: z
    .string()
    .min(1, "email or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
