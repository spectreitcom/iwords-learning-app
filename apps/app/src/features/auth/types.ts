import { z } from "zod";

export const currentLoggedUserSchema = z.object({
  userId: z.string(),
  email: z.string(),
  name: z.string(),
  blocked: z.boolean(),
});

export type CurrentLoggedUser = z.infer<typeof currentLoggedUserSchema>;
