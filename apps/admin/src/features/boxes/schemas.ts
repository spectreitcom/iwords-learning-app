import { z } from "zod";

export const createBoxSchema = z.object({
  title: z.string().min(1, {
    message: "To pole jest wymagane",
  }),
});

export type CreateBoxData = z.infer<typeof createBoxSchema>;
