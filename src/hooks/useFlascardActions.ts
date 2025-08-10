import { addFlashCard, deleteFlashcard, fetchFlashcardsByBook } from "@/lib/api/flascards";
import { Flashcard } from "@/schemas/flashcard";
import { useFlashcardStore } from "@/stores/useFlascardStore";
import { useCallback } from "react";
import toast from "react-hot-toast";

export const useFlascardActions = ({
    bookId,
    setFlasCards,
    setFlashcardPagination,
    setIsLoading,
    setFlascardModalOpened,
  }: {
    bookId: string;
    setFlasCards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
    setFlashcardPagination?: React.Dispatch<React.SetStateAction<{ totalItems: number; totalPages: number; currentPage: number; limit: number }>>;
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    setFlascardModalOpened?: (open: boolean) => void;

}) => { 

  const { setFlashcardsForBook } = useFlashcardStore();
  
    const handleAddFlashcard =  async (flashcard: Flashcard, page = 1) => {
      try {
        const result = await toast.promise(
          addFlashCard(bookId, flashcard).then((res) => {
            if (!res.success) {
              throw new Error(res.message || "Failed to add flashcard.");
            }
            return res;
          }),
          {
            loading: "🚀 Adding a flashcard...",
            success: "Flashcard added successfully!",
            error: "Failed to add flashcard.",
          }
        );
        setFlasCards((prev) => [...prev, result.data]);
        loadFlashcards(page);
      } catch (err) {
        console.error(err);
      } finally {
        setFlascardModalOpened?.(false);
      }
    };

  const handleDeleteFlashcard =
    async (flashcardId: string, page = 1) => {
      try {
      await toast.promise(
        deleteFlashcard(flashcardId).then((res) => {
          if (!res.success) {
            throw new Error(res.message || "Failed to delete flashcard.");
          }
          loadFlashcards(page);
        }),
        {
          loading: "Deleting flashcard...",
          success: "Flashcard deleted successfully!",
          error: "Failed to delete flashcard.",
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadFlashcards = useCallback(
    async (page = 1) => {
      if (!bookId) return;
      try {
        setIsLoading?.(true);
        const result = await fetchFlashcardsByBook(bookId, page);
        if (result.success) {
          setFlasCards(result.data);
          setFlashcardPagination?.(result.pagination);
          setFlashcardsForBook(bookId, result.data);
        } else {
          alert(result.message || "Failed to load flashcards.");
        }
      } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat memuat flashcards.");
      } finally {
        setIsLoading?.(false);
      }
    },
    [bookId, setFlasCards, setIsLoading, setFlashcardPagination]
  );

  return { handleAddFlashcard, handleDeleteFlashcard, loadFlashcards };
}