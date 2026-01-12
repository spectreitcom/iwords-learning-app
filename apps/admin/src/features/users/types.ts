import { z } from "zod";

export const userSchema = z.object({
  userId: z.string(),
  email: z.string(),
  name: z.string(),
  blocked: z.boolean(),
});

export type User = z.infer<typeof userSchema>;
