import { z } from "zod";

export const boxRepetitionSchema = z.object({
  boxId: z.string(),
  title: z.string(),
  repetitionCount: z.number(),
  isFinished: z.boolean(),
  expressionsCount: z.number(),
});

export type BoxRepetition = z.infer<typeof boxRepetitionSchema>;
