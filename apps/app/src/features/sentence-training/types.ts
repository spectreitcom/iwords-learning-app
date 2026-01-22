import { expressionContextTypeSchema } from "@/lib/types";
import { z } from "zod";

const sentenceSchema = z.object({
  sentenceId: z.string(),
  content: z.string(),
  translation: z.string(),
});

export const expressionContextSchema = z.object({
  expressionContextId: z.string(),
  expressionId: z.string(),
  phrase: z.string(),
  translation: z.string(),
  type: expressionContextTypeSchema,
  isIrregular: z.boolean(),
  isCountable: z.boolean(),
  definition: z.string().nullable(),
  definitionTranslation: z.string().nullable(),
  sentences: z.array(sentenceSchema),
});

export type ExpressionContext = z.infer<typeof expressionContextSchema>;

export const validateSentenceResponseSchema = z.object({
  score: z.number(),
  answer: z.string(),
});
