import { z } from "zod";
export type CollectionWithPagination<T> = {
  data: T[];
  total: number;
  currentPage: number;
};

export const collectionWithPaginationSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    data: z.array(dataSchema),
    total: z.number(),
    currentPage: z.number(),
  });

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
