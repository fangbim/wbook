import {
  addQuote,
  editQuote,
  deleteQuote,
  fetchQuotesByBook,
} from "@/lib/api/quotes";
import { useQuotesStore } from "@/stores/useQuoteStore";
import { useCallback } from "react";
import toast from "react-hot-toast";

interface Quote {
    id: string;
    content: string;
    page?: string;
}

interface NewQuote {
  content: string;
  page?: string;
}

export const useQuoteActions = ({
  bookId,
  setQuotes,
  setQuotePagination,
  setIsLoading,
  setQuoteModalOpened,
}: {
  bookId: string;
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  setQuotePagination?: React.Dispatch<React.SetStateAction<{ totalItems: number; totalPages: number; currentPage: number; limit: number }>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setQuoteModalOpened?: (open: boolean) => void;
}) => {

  const { setQuotesForBook } = useQuotesStore();
  
  const handleAddQuote = async (quote: NewQuote, page = 1) => {
    try {
      const result = await toast.promise(
        addQuote(bookId, quote).then((res) => {
          if (!res.success) {
            throw new Error(res.message || "Failed to add quote.");
          }
          return res;
        }),
        {
          loading: "🚀 Adding a quote...",
          success: "Quote added successfully!",
          error: "Failed to add quote.",
        }
      );

      setQuotes((prev) => [...prev, result.data]);
      loadQuotes(page);
    } catch (err) {
      console.error(err);
    } finally {
      setQuoteModalOpened?.(false);
    }
  };

  const handleEditQuote = async (quoteId: string, content: string, page: number) => {
    try {
      const result = await editQuote(quoteId, content, page);
      if (result?.success) {
        setQuotes((prev) =>
          prev.map((q) =>
            q.id === quoteId
              ? { ...q, content, page: page !== undefined ? String(page) : q.page }
              : q
          )
        );
        toast.success("Quote updated successfully!");
      } else {
        toast.error(result?.message || "Failed to update quote.");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error updating quote.");
    }
  };

  const handleDeleteQuote = async (quoteId: string, page = 1) => {
    try {
      await toast.promise(
        deleteQuote(quoteId).then((res) => {
          if (!res.success) {
            throw new Error(res.message || "Failed to delete quote.");
          }
        loadQuotes(page);
        }),
        {
          loading: "Deleting quote...",
          success: "Quote deleted successfully!",
          error: "Failed to delete quote.",
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadQuotes = useCallback(async (page = 1) => {
    if (!bookId) return;
    try {
      setIsLoading?.(true);
      const result = await fetchQuotesByBook(bookId, page);
      if (result.success) {
        setQuotes(result.data);
        setQuotePagination?.(result.pagination);
        setQuotesForBook(bookId, result.data);
      } else {
        toast.error(result.message || "❌ Failed to load quotes.");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error loading quotes.");
    } finally {
      setIsLoading?.(false);
    }
  }, [bookId, setIsLoading, setQuotes, setQuotePagination]);

  return {
    handleAddQuote,
    handleEditQuote,
    handleDeleteQuote,
    loadQuotes,
  };
};
