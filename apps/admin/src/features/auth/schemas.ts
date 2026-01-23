import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({
    message: "Podaj poprawny adres email",
  }),
  password: z.string().min(1, {
    message: "Hasło jest wymagane",
  }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
