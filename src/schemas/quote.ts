import { z } from "zod";

export const quoteSchema = z.object({
  id: z.string(),
  content: z.string(),
  page: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Quote = z.infer<typeof quoteSchema>;
