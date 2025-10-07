import { z } from "zod";

export const inviteAdminUserSchema = z.object({
  email: z.string().email({
    message: "Nieprawidłowy adres email",
  }),
  name: z.string().min(1, {
    message: "To pole jest wymagane",
  }),
});

export type InviteAdminUserData = z.infer<typeof inviteAdminUserSchema>;
