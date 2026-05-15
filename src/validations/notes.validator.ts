import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  isArchived: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});
