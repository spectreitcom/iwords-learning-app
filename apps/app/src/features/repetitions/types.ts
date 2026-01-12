import { expressionContextTypeSchema } from "@/lib/types";
import { z } from "zod";

export const repetitionExpressionContextSchema = z.object({
  expressionContextId: z.string(),
  expressionId: z.string(),
  phrase: z.string(),
  translation: z.string(),
  type: expressionContextTypeSchema,
  forms: z.tuple([z.string(), z.string(), z.string()]).nullable(),
  isCountable: z.boolean(),
  isIrregular: z.boolean(),
  sentences: z.array(
    z.object({
      sentenceId: z.string(),
      content: z.string(),
      translation: z.string(),
    }),
  ),
});

export type RepetitionExpressionContext = z.infer<
  typeof repetitionExpressionContextSchema
>;

export const repetitionSchema = z.object({
  repetitionId: z.string(),
  expressionContext: repetitionExpressionContextSchema,
});

export type Repetition = z.infer<typeof repetitionSchema>;
