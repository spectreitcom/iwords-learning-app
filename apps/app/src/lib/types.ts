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

export {
  expressionContextTypeSchema,
  type ExpressionContextType,
} from "@repo/shared/types";
