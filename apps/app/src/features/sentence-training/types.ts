import { z } from "zod";

export const validateSentenceResponseSchema = z.object({
  score: z.number(),
  answer: z.string(),
});
