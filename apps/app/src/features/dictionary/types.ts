import { z } from "zod";
import { expressionContextTypeSchema } from "@/lib/types";

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
  forms: z.array(z.string()).nullable().optional(),
  isCountable: z.boolean(),
  definition: z.string().nullable(),
  definitionTranslation: z.string().nullable(),
  sentences: z.array(sentenceSchema),
});

export type ExpressionContext = z.infer<typeof expressionContextSchema>;

export const searchedExpressionContextSchema = expressionContextSchema.pick({
  phrase: true,
  translation: true,
  expressionContextId: true,
  expressionId: true,
});

export type SearchedExpressionContext = z.infer<
  typeof searchedExpressionContextSchema
>;
