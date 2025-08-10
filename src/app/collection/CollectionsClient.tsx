"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { SimpleGrid, Loader, Skeleton, Container, Title, Text, ActionIcon, Transition } from "@mantine/core";
import BookCover from "@/components/BookCover";
import SearchBookOverlay from "./SearchBookOverlay";
import { IoSearch, IoAdd } from "react-icons/io5";
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
        console.error("Failed to add:", result.message);
        toast.error("Failed to add book.");
      }
    } catch (err) {
      console.error("Error adding book:", err);
      toast.error("An error occurred when adding a book.");
    }
  };

  const handleBookClick = (bookId: string) => {
    router.push(`/collection/books/${bookId}`);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center space-y-4">
          <Loader size="lg" color="gray" />
          <Text size="sm" c="dimmed" fw={500}>Loading your library...</Text>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <Navbar
          user={{
            name: session.user?.name || undefined,
            avatarUrl: "/avatars/fajar.jpg",
          }}
        />

        <Container size="xl" py="sm">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <Title 
              order={1} 
              size="h1" 
              fw={600} 
              c="dark.8" 
              className="mb-3"
            >
              My Library
            </Title>
            <Text size="lg" c="dimmed" fw={400}>
              {userBooks.length > 0 
                ? `${userBooks.length} books in your collection`
                : "Start building your personal library"
              }
            </Text>
          </div>

          {/* Books Grid */}
          {loadingBooks ? (
            <SimpleGrid 
              cols={{ base: 2, xs: 3, sm: 4, md: 5, lg: 6, xl: 7 }} 
              spacing="xl"
              verticalSpacing="xl"
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton 
                    height={200} 
                    radius="md" 
                    className="shadow-sm"
                  />
                  <div className="space-y-2">
                    <Skeleton height={12} width="85%" />
                    <Skeleton height={10} width="65%" />
                  </div>
                </div>
              ))}
            </SimpleGrid>
          ) : userBooks.length > 0 ? (
            <SimpleGrid 
              cols={{ base: 2, xs: 3, sm: 4, md: 5, lg: 6, xl: 7 }} 
              spacing="xl"
              verticalSpacing="xl"
            >
              {userBooks.map((book, index) => (
                <BookCover
                  key={`${book.id}-${index}`}
                  src={book.coverUrl || "/placeholder-book.png"}
                  title={book.title}
                  author={
                    Array.isArray(book.author)
                      ? book.author.join(", ")
                      : book.author || "Unknown Author"
                  }
                  onClick={() => handleBookClick(book.id)}
                />
              ))}
            </SimpleGrid>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <IoSearch className="w-10 h-10 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <Title order={3} c="dark.6" fw={500}>
                    No books yet
                  </Title>
                  <Text c="dimmed" size="sm">
                    Start by adding your first book to the collection
                  </Text>
                </div>
              </div>
            </div>
          )}
        </Container>

        {/* Floating Action Button */}
        <Transition 
          mounted={!isSearchExpanded} 
          transition="slide-up" 
          duration={300} 
          timingFunction="ease"
        >
          {(styles) => (
            <div 
              style={styles}
              className="fixed bottom-8 right-8 z-30"
            >
              <ActionIcon
                onClick={() => setIsSearchExpanded(true)}
                size={56}
                radius="xl"
                variant="filled"
                color="dark"
                className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-gray-800 to-gray-700 border-0"
              >
                <IoAdd className="w-6 h-6" />
              </ActionIcon>
            </div>
          )}
        </Transition>

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