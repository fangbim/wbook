// stores/useUserBooksStore.ts
import { create } from "zustand";

export interface BookData {
  id: string;
  title: string;
  author?: string[] | string;
  publishYear?: number;
  isbn?: string[] | string;
  coverUrl?: string;
  subjects?: string[];
  publishers?: string[] | string;
}

interface UserBooksState {
  userBooks: BookData[];
  setUserBooks: (books: BookData[]) => void;
  addBook: (book: BookData) => void;
  removeBook: (bookId: string) => void;
}

export const useUserBooksStore = create<UserBooksState>((set) => ({
  userBooks: [],
  setUserBooks: (books) => set({ userBooks: books }),
  addBook: (book) => set((state) => ({ userBooks: [...state.userBooks, book] })),
  removeBook: (bookId) =>
    set((state) => ({
      userBooks: state.userBooks.filter((b) => b.id !== bookId),
    })),
}));
