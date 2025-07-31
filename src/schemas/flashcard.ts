import z from "zod";

export const flashcardSchema = z.object({
    id: z.string().optional(),
    front: z.string(),
    back: z.string(),
});

export type Flashcard = z.infer<typeof flashcardSchema>;