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

export const requestForResetPasswordSchema = z.object({
  email: z.email({ message: "Podaj poprawny adres email" }),
});

export type RequestForResetPasswordData = z.infer<
  typeof requestForResetPasswordSchema
>;

export const resetPasswordSchema = z.object({
  password: z.string().min(1, {
    message: "To pole jest wymagane",
  }),
});

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
  existingPassword: z.string().min(1, {
    message: "To pole jest wymagane",
  }),
  newPassword: z.string().min(1, { message: "To pole jest wymagane" }),
});

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
