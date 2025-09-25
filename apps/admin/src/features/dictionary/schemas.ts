import { z } from "zod";

export const createExpressionSchema = z.object({
  phrase: z.string().min(1, {
    message: "To pole jest wymagane",
  }),
});

export type CreateExpressionSchema = z.infer<typeof createExpressionSchema>;
