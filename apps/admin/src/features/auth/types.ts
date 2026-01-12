import { z } from "zod";

export const userSchema = z.object({
  adminUserId: z.string(),
  email: z.string(),
  name: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
