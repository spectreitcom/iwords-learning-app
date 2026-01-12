import { expressionContextTypeSchema } from "@/lib/types";
import { z } from "zod";

export const expressionContextSchema = z.object({
  expressionContextId: z.string(),
  expressionId: z.string(),
  phrase: z.string(),
  translation: z.string(),
  type: expressionContextTypeSchema,
});

export type ExpressionContext = z.infer<typeof expressionContextSchema>;

export const validateSentenceResponseSchema = z.object({
  score: z.number(),
  answer: z.string(),
});

export type ValidateSentenceResponse = z.infer<
  typeof validateSentenceResponseSchema
>;
