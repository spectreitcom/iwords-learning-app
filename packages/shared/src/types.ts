import { z } from "zod";

export const expressionContextTypeSchema = z.enum([
  "verb",
  "noun",
  "adjective",
  "adverb",
  "phrasal_verb",
  "irregular_verb",
  "simple_expression",
]);

export type ExpressionContextType = z.infer<typeof expressionContextTypeSchema>;
