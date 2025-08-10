import { create } from "zustand";

export interface Flashcard {
    id?: string;
    front: string;
    back: string;
    difficulty?: "easy" | "medium" | "hard";
    lastReviewed?: Date;
    correctCount?: number;
    incorrectCount?: number;
}

interface FlashcardState {
    flashcards: Record<string, Flashcard[]>;
    setFlashcardsForBook: (bookId: string, flashcards: Flashcard[]) => void;
    addFlashcard: (bookId: string, flashcard: Flashcard) => void;
    editFlashcard: (bookId: string, flashcardId: string, front: string, back: string) => void;
    deleteFlashcard: (bookId: string, flashcardId: string) => void;
    getFlashcardsByBookId: (bookId: string) => Flashcard[];
    getTotalFlashcards: () => number;
    getAllFlashcards: () => Flashcard[];
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
    flashcards: {},
    setFlashcardsForBook: (bookId: string, flashcards: Flashcard[]) => {
        set((state) => ({
            flashcards: {
                ...state.flashcards,
                [bookId]: flashcards,
            },
        }));
    },
    addFlashcard: (bookId: string, flashcard: Flashcard) => {
        set((state) => ({
            flashcards: {
                ...state.flashcards,
                [bookId]: [...(state.flashcards[bookId] || []), flashcard],
            },
        }));
    },
    editFlashcard: (bookId: string, flashcardId: string, front: string, back: string) => {
        set((state) => ({
            flashcards: {
                ...state.flashcards,
                [bookId]: (state.flashcards[bookId] || []).map((f) =>
                    f.id === flashcardId ? { ...f, front, back } : f
                ),
            },
        }));
    },
    deleteFlashcard: (bookId: string, flashcardId: string) => {
        set((state) => ({
            flashcards: {
                ...state.flashcards,
                [bookId]: (state.flashcards[bookId] || []).filter((f) => f.id !== flashcardId),
            },
        }));
    },
    getFlashcardsByBookId: (bookId: string) => {
        const { flashcards } = get();
        return flashcards[bookId] || [];
    },
    getTotalFlashcards: () => {
        const { flashcards } = get();
        return Object.values(flashcards).reduce((total, bookFlashcards) => total + bookFlashcards.length, 0);
    },
    getAllFlashcards: () => {
        const { flashcards } = get();
        return Object.values(flashcards).flat();
    },
}));