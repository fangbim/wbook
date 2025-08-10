// components/SearchOverlay.tsx
"use client";

import { Loader, Button } from "@mantine/core";
import { IoSearch, IoClose, IoAdd } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BiSolidDetail } from "react-icons/bi";

interface BookData {
  id: string;
  title: string;
  author?: string[];
  publishYear?: number;
  isbn?: string[];
  coverUrl?: string;
  subjects?: string[];
  publishers?: string[];
}

interface SearchResponse {
  success: boolean;
  data: BookData[];
  total: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (book: BookData) => void;
}

export default function SearchBookOverlay({ isOpen, onClose, onAdd }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BookData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchType, setSearchType] = useState<"general" | "title" | "author">(
    "general"
  );

  const searchBooks = async (query: string, type: string = "general") => {
    if (!query && type !== "general") return;

    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams();
      if (type === "general") searchParams.set("q", query);
      else searchParams.set(type, query);
      searchParams.set("limit", "12");

      const response = await fetch(`/api/book?${searchParams}`);
      const data: SearchResponse = await response.json();

      if (data.success) {
        setSearchResults(data.data);
        setHasSearched(true);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      const timeoutId = setTimeout(() => {
        searchBooks(value, searchType);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBooks(searchQuery, searchType);
  };

  useEffect(() => {
    if (isOpen && !hasSearched) {
      searchBooks("", "general");
    }
  }, [isOpen]);

  const handleBookClick = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };

  return (
    <>
      {/* Overlay Background */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Search Panel */}
      <div
        className={`fixed inset-x-4 top-8 bottom-8 bg-white rounded-xl shadow-2xl z-50 transition-all duration-500 flex flex-col ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-8 pointer-events-none"
        }`}
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Search Book</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <IoClose className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Search Controls */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              {["general", "title", "author"].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setSearchType(key as "general" | "title" | "author")
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    searchType === key
                      ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {key === "general"
                    ? "All"
                    : key === "title"
                    ? "Title"
                    : "Author"}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Type title, author..."
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              {isLoading && (
                <Loader
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                />
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center py-12">
              <Loader size="lg" color="black" />
              <p className="text-gray-600 mt-4">Searching for books...</p>
            </div>
          ) : hasSearched ? (
            searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((book, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-green-400 transition cursor-pointer"
                  >
                    <img
                      src={book.coverUrl || "/placeholder-book.png"}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded-md border border-gray-100 flex-shrink-0"
                    />

                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                        {book.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {Array.isArray(book.author)
                          ? book.author.slice(0, 2).join(", ")
                          : book.author || "Tidak diketahui"}
                      </p>

                      <div className="flex gap-2 mt-2">
                        <Button
                          size="xs"
                          variant="outline"
                          color="gray"
                          className="text-xs px-2"
                          onClick={() => handleBookClick(book.id)}
                          rightSection={<BiSolidDetail size={12} />}
                        >
                          Details
                        </Button>
                        <Button
                          size="xs"
                          variant="filled"
                          color="teal"
                          className="text-xs px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAdd(book);
                          }}
                          rightSection={<IoAdd size={12} />}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-12">
                No results found for &ldquo;{searchQuery}&rdquo;
              </div>
            )
          ) : (
            <div className="text-center text-gray-500 py-12">
              Type to start searching for books
            </div>
          )}
        </div>
      </div>
    </>
  );
}
