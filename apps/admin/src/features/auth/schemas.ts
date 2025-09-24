import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Podaj poprawny adres email",
  }),
  password: z.string().min(1, {
    error: "Hasło jest wymagane",
  }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
