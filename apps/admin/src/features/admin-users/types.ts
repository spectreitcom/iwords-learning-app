import { z } from "zod";

export const adminUserSchema = z.object({
  adminUserId: z.string(),
  email: z.string(),
  name: z.string(),
  blocked: z.boolean(),
});

export type AdminUser = z.infer<typeof adminUserSchema>;
