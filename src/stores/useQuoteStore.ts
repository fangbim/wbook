import { create } from "zustand";

export interface Quote {
  id: string;
  content: string;
  page?: string;
  category?: string;
  isFavorite?: boolean;
  dateAdded?: Date;
}

interface QuotesState {
  bookQuotes: Record<string, Quote[]>;
  setQuotesForBook: (bookId: string, quotes: Quote[]) => void;
  addQuote: (bookId: string, quote: Quote) => void;
  editQuote: (bookId: string, quoteId: string, content: string, page?: string) => void;
  deleteQuote: (bookId: string, quoteId: string) => void;
  toggleFavorite: (bookId: string, quoteId: string) => void;
  getTotalQuotes: () => number; 
  getAllQuotes: () => Quote[];
  getQuotesByBookId: (bookId: string) => Quote[];
}

export const useQuotesStore = create<QuotesState>((set, get) => ({
  bookQuotes: {},

  setQuotesForBook: (bookId: string, quotes: Quote[]) => {
    set((state) => ({
      bookQuotes: {
        ...state.bookQuotes,
        [bookId]: quotes,
      },
    }));
  },

  addQuote: (bookId: string, quote: Quote) => {
    set((state) => ({
      bookQuotes: {
        ...state.bookQuotes,
        [bookId]: [...(state.bookQuotes[bookId] || []), quote],
      },
    }));
  },

  editQuote: (bookId: string, quoteId: string, content: string, page?: string) => {
    set((state) => ({
      bookQuotes: {
        ...state.bookQuotes,
        [bookId]: (state.bookQuotes[bookId] || []).map((q) =>
          q.id === quoteId ? { ...q, content, page } : q
        ),
      },
    }));
  },

  deleteQuote: (bookId: string, quoteId: string) => {
    set((state) => ({
      bookQuotes: {
        ...state.bookQuotes,
        [bookId]: (state.bookQuotes[bookId] || []).filter((q) => q.id !== quoteId),
      },
    }));
  },

  toggleFavorite: (bookId: string, quoteId: string) => {
    set((state) => ({
      bookQuotes: {
        ...state.bookQuotes,
        [bookId]: (state.bookQuotes[bookId] || []).map((q) =>
          q.id === quoteId ? { ...q, isFavorite: !q.isFavorite } : q
        ),
      },
    }));
  },

  // ✅ Hitung total semua quotes
  getTotalQuotes: () => {
    const { bookQuotes } = get();
    return Object.values(bookQuotes).reduce((total, quotes) => total + quotes.length, 0);
  },

  // ✅ Ambil semua quotes dalam 1 array
  getAllQuotes: () => {
    const { bookQuotes } = get();
    return Object.values(bookQuotes).flat();
  },

  getQuotesByBookId: (bookId: string) => {
    const { bookQuotes } = get();
    return bookQuotes[bookId] || [];
  },
}));
