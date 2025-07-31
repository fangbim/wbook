import { Flashcard } from "@/schemas/flashcard";


export const fetchFlashcardsByBook = async (bookId: string, page = 1, limit = 4) => {
  const res = await fetch(`/api/user/flascards/${bookId}?page=${page}&limit=${limit}`);
  return res.json();
}

export const addFlashCard = async (bookId: string, flashcard: Flashcard) => {
  const res = await fetch("/api/user/flascards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, ...flashcard }),
  });
  return res.json();
};

export const deleteFlashcard = async (flashcardId: string) => {
  const res = await fetch(`/api/user/flascards/by-id/${flashcardId}`, {
    method: "DELETE",
  });
  return res.json();
}