import { z } from "zod";

export const noteSchema = z.object({
  id: z.string().uuid(),
  expressionContextId: z.string().uuid(),
  userId: z.string(),
  title: z.string(),
  content: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Note = z.infer<typeof noteSchema>;

export const createNoteSchema = z.object({
  title: z.string().min(3).max(120),
  expressionContextId: z.string().uuid(),
});

export const updateNoteTitleSchema = z.object({
  title: z.string().min(3).max(120),
});

export const updateNoteContentSchema = z.object({
  content: z.string().optional(),
});
