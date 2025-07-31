"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { SimpleGrid, Loader, Skeleton } from "@mantine/core";
import BookCover from "@/components/BookCover";
import SearchBookOverlay from "./SearchBookOverlay";
import { IoSearch } from "react-icons/io5";
import { useUserBooksStore } from "@/stores/useUserBooksStore";
import toast from "react-hot-toast";

interface BookData {
  id: string;
  title: string;
  author?: string[] | string;
  publishYear?: number;
  isbn?: string[];
  coverUrl?: string;
  subjects?: string[];
  publishers?: string[];
}

export default function CollectionsClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { userBooks, setUserBooks } = useUserBooksStore();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUserBooks = async () => {
        try {
          setLoadingBooks(true);
          const res = await fetch("/api/user/books");
          const data = await res.json();
          if (data.success) {
            setUserBooks(data.data);
          }
        } catch (err) {
          console.error("Error fetching user books:", err);
        } finally {
          setLoadingBooks(false);
        }
      };

      fetchUserBooks();
    }
  }, [status, setUserBooks]);

  const addToUserCollection = async (book: BookData) => {
    if (userBooks.some((b) => b.id === book.id)) {
      toast("The book is already in your collection!", {
        icon: "👏",
      });
      return;
    }

    try {
      const res = await fetch("/api/user/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setUserBooks([...userBooks, book]);
        toast.success("Book successfully added to collection!");
      } else {
        console.error("Gagal menambahkan:", result.message);
        toast.error("Failed to add book.");
      }
    } catch (err) {
      console.error("Error saat menambahkan buku:", err);
      toast.error("An error occurred when adding a book.");
    }
  };

  const handleBookClick = (bookId: string) => {
    router.push(`/collection/books/${bookId}`);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader size="xl" color="cyan" className="mb-4" />
          <p className="text-lg text-gray-600">Loading User...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar
          user={{
            name: session.user?.name || undefined,
            avatarUrl: "/avatars/fajar.jpg",
          }}
        />

        <div className="flex-1 p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 mx-2 md:mx-12 lg:mx-20 pb-8">
            My Book Collection
          </h2>
          <SimpleGrid
            cols={{ base: 2, sm: 4, lg: 8 }}
            className="mx-2 md:mx-16 lg:mx-24"
          >
            {loadingBooks
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton height={140} radius="md" />
                    <Skeleton height={12} width="80%" />
                    <Skeleton height={10} width="60%" />
                  </div>
                ))
              : userBooks.map((book, index) => (
                  <BookCover
                    key={index}
                    src={book.coverUrl || "/placeholder-book.png"}
                    title={book.title}
                    author={
                      Array.isArray(book.author)
                        ? book.author.join(", ")
                        : book.author || "Tidak Diketahui"
                    }
                    onClick={() => handleBookClick(book.id)}
                  />
                ))}
          </SimpleGrid>
        </div>

        <div
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-500 z-30 ${
            isSearchExpanded
              ? "opacity-0 scale-95 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
        >
          <button
            onClick={() => setIsSearchExpanded(true)}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="font-medium">Search Book</span>
            <IoSearch className="w-5 h-5" />
          </button>
        </div>

        <SearchBookOverlay
          isOpen={isSearchExpanded}
          onClose={() => setIsSearchExpanded(false)}
          onAdd={addToUserCollection}
        />
      </div>
    );
  }

  return null;
}
