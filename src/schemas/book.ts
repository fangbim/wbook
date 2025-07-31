import { z } from "zod";

// Gunakan string dulu untuk DateTime jika berasal dari API
export const bookSchema = z.object({
  id: z.string().optional(),
  coverUrl: z.string().optional(),
  title: z.string(),
  author: z.string(),
  category: z.string(),
  language: z.string(),
  publisher: z.string(),
  publishedAt: z.string() , 
  pageCount: z.number(),
  isbn: z.string(),
  description: z.string(),
  createdAt: z.string(),
});

export const userBookSchema = z.object({
  status: z.string(),
  progress: z.number(),
  addedAt: z.string(),
});

// Gunakan z.infer untuk bikin type seperti interface
export type Book = z.infer<typeof bookSchema>;
export type UserBook = z.infer<typeof userBookSchema>;
