"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { LuQuote } from "react-icons/lu";

import { GoEye } from "react-icons/go";
import { HiOutlineBookOpen } from "react-icons/hi";

import AddQuote from "@/components/Quotes/AddQuote";
import BookHeader from "@/components/BookDetails/BookHeader";
import BookOverview from "@/components/BookDetails/BookOverview";
import Quotes from "@/components/Quotes/Quotes";
import FlashCard from "@/components/FlashCard/FlashCard";
import ReadingStatus from "@/components/BookDetails/ReadingStatus";
import BookDetails from "@/components/BookDetails/BookDetails";
import Activity from "@/components/BookDetails/Activity";
import { useQuoteActions } from "@/hooks/useQuoteActions";
import AddFlashCard from "@/components/FlashCard/AddFlashCard";
import { useFlascardActions } from "@/hooks/useFlascardActions";
import { Flashcard } from "@/schemas/flashcard";
import CustomePagination from "@/components/Pagination";
import { Book, UserBook } from "@/schemas/book";
import EditQuote from "@/components/Quotes/EditQuote";
import { Quote } from "@/schemas/quote";



interface BookDetailClientProps {
  book: Book;
  userbook: UserBook;
}

export default function UserBookDetailClient({
  book,
  userbook,
}: BookDetailClientProps) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [quotePagination, setQuotePagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 4,
  });

  const [flashcardPagination, setFlashcardPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 4,
  });

  const [editQuoteModalOpened, setEditQuoteModalOpened] = useState(false);
  const [editQuoteId, setEditQuoteId] = useState<string | null>(null);
  const [editQuoteContent, setEditQuoteContent] = useState("");
  const [editQuotePage, setEditQuotePage] = useState<number | undefined>(undefined);

  const openEditQuoteModal = (id: string, content: string, page?: string) => {
    setEditQuoteId(id);
    setEditQuoteContent(content);
    setEditQuotePage(page ? parseInt(page, 10) : undefined);
    setEditQuoteModalOpened(true);
  };

  const [isQuoteModalOpened, setQuoteModalOpened] = useState(false);
  const [isFlashcardModalOpened, setFlashcardModalOpened] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const Eye = () => <GoEye className="w-4 h-4" />;
  const Quote = () => <LuQuote className="w-4 h-4" />;
  const BookOpen = () => <HiOutlineBookOpen className="w-4 h-4" />;

  const { handleAddQuote, handleEditQuote, handleDeleteQuote, loadQuotes } =
    useQuoteActions({
      bookId: book.id ?? "",
      setQuotes,
      setQuotePagination,
      setIsLoading: undefined,
      setQuoteModalOpened,
    });

  const { handleAddFlashcard, handleDeleteFlashcard, loadFlashcards } =
    useFlascardActions({
      bookId: book.id ?? "",
      setFlasCards: setFlashcards,
      setFlashcardPagination,
      setFlascardModalOpened: setFlashcardModalOpened,
    });

  const handleUpdateQuote = (updatedQuote: {
    id: string;
    content: string;
    page: number;
  }) => {
    handleEditQuote(updatedQuote.id, updatedQuote.content, updatedQuote.page);
  };

  useEffect(() => {
    const shouldLoadQuotes =
      !!userbook && book?.id && typeof userbook.progress === "number";

    if (shouldLoadQuotes) {
      loadQuotes();
      loadFlashcards();
    }
  }, [userbook, book?.id, loadQuotes, loadFlashcards]);

  const handleQuotePageChange = (page: number) => {
    loadQuotes(page);
  };

  const handleFlashcardPageChange = (page: number) => {
    loadFlashcards(page);
  };

  return (
    <>
      <AddQuote
        opened={isQuoteModalOpened}
        onClose={() => setQuoteModalOpened(false)}
        onAddQuote={handleAddQuote}
      />

      <AddFlashCard
        opened={isFlashcardModalOpened}
        onClose={() => setFlashcardModalOpened(false)}
        onAddFlashCard={handleAddFlashcard}
      />
      <EditQuote
        opened={editQuoteModalOpened}
        onClose={() => setEditQuoteModalOpened(false)}
        quoteId={editQuoteId}
        initialContent={editQuoteContent}
        initialPage={editQuotePage ?? 0}
        onUpdateQuote={handleUpdateQuote}
      />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ">
        <Navbar
          user={{
            name: session?.user?.name || undefined,
            avatarUrl: "/avatars/fajar.jpg",
          }}
        />
        <div className="flex flex-col w-full max-w-6xl mx-auto gap-8 px-4 sm:px-6 lg:px-0 mb-12">
          {/* Header Buku */}
          <BookHeader
            book={book}
            isFavorited={isFavorited}
            setIsFavorited={setIsFavorited}
          />
          {/* Konten dan Sidebar */}
          <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
            {/* Konten Tab */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex text-xs md:text-md">
                  {[
                    { id: "overview", label: "Overview", icon: Eye },
                    { id: "quotes", label: "Quotes", icon: Quote },
                    { id: "flashcards", label: "Flashcards", icon: BookOpen },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <tab.icon />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-6">
                {activeTab === "overview" && <BookOverview book={book} />}
                {activeTab === "quotes" && (
                  <>
                    <Quotes
                      quotes={quotes}
                      currentPage={quotePagination.currentPage}
                      limit={quotePagination.limit}
                      setQuoteModalOpened={setQuoteModalOpened}
                      handleDeleteQuote={(quoteId) =>
                        handleDeleteQuote(quoteId, quotePagination.currentPage)
                      }
                      handleEditQuote={(id, content) => {
                        const quote = quotes.find((q) => q.id === id);
                        openEditQuoteModal(id, content, quote?.page);
                      }}
                    />
                    <CustomePagination
                      total={quotePagination.totalItems}
                      page={quotePagination.currentPage}
                      limit={quotePagination.limit}
                      onPageChange={handleQuotePageChange}
                    />
                  </>
                )}
                {activeTab === "flashcards" && (
                  <>
                    <FlashCard
                      flashcards={flashcards}
                      currentPage={flashcardPagination.currentPage}
                      limit={flashcardPagination.limit}
                      setFlascardModalOpened={setFlashcardModalOpened}
                      handleDeleteFlashcard={handleDeleteFlashcard}
                    />
                    <CustomePagination
                      total={flashcardPagination.totalItems}
                      page={flashcardPagination.currentPage}
                      limit={flashcardPagination.limit}
                      onPageChange={handleFlashcardPageChange}
                    />
                  </>
                )}
              </div>
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              <ReadingStatus userBook={userbook ?? undefined} book={book} />
              <BookDetails book={book} userbook={userbook} />
              <Activity
                totalQuotes={quotePagination.totalItems}
                totalFlashcards={flashcardPagination.totalItems}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
