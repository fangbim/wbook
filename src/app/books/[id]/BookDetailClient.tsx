"use client";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { GoEye, GoBook, GoStar, GoHeart } from "react-icons/go";
import BookHeader from "@/components/BookDetails/BookHeader";
import BookOverview from "@/components/BookDetails/BookOverview";
import { useState } from "react";
import { formatISBN } from "@/utils/isbn";
import { Book } from "@/schemas/book";
import ReviewItem from "../ReviewItem";

interface BookDetailClientProps {
  book: Book;
}

const reviews = [
  {
    id: "1",
    user: { name: "Sarah W.", avatarUrl: "/avatars/sarah.jpg" },
    rating: 5,
    content:
      "An absolutely fantastic read! Couldn't put it down. The characters are so well-developed and the plot is gripping.",
  },
  {
    id: "2",
    user: { name: "David L.", avatarUrl: "/avatars/david.jpg" },
    rating: 4,
    content:
      "A very interesting perspective on the topic. Well-researched and thought-provoking, though it dragged a bit in the middle.",
  },
  {
    id: "3",
    user: { name: "Mia K.", avatarUrl: "/avatars/mia.jpg" },
    rating: 5,
    content: "This book changed my life! I highly recommend it to everyone.",
  },
];

const rating = (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1);

export default function BookDetailClient({ book }: BookDetailClientProps) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const formatDate = (date: string | Date) => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: GoEye },
    { id: "details", label: "Details", icon: GoBook },
    { id: "reviews", label: "Reviews", icon: GoStar },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar
        user={{
          name: session?.user?.name || undefined,
          avatarUrl: "/avatars/fajar.jpg",
        }}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Book Header */}
          <BookHeader
            book={book}
            isFavorited={isFavorited}
            setIsFavorited={setIsFavorited}
          />

          {/* Content Grid */}
          <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex" role="tablist">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600 bg-blue-50"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <BookOverview
                    book={{
                      ...book,
                      publishedAt: formatDate(book.publishedAt),
                    }}
                  />
                )}

                {activeTab === "details" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Book Information
                    </h3>
                    <div className="grid gap-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">ISBN</span>
                        <span className="font-medium text-gray-900">
                          {formatISBN(book.isbn) || "Not available"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Publisher</span>
                        <span className="font-medium text-gray-900">
                          {book.publisher}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Published</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(book.publishedAt)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Category</span>
                        <span className="font-medium text-gray-900">
                          {book.category}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Language</span>
                        <span className="font-medium text-gray-900">
                          {book.language}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Pages</span>
                        <span className="font-medium text-gray-900">
                          {book.pageCount}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Reviews ({reviews.length})
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <GoStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(parseFloat(rating))
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {rating} ({reviews.length} reviews)
                        </span>
                      </div>
                    </div>

                    {/* ✅ INI BAGIAN UTAMANYA */}
                    <div className="space-y-6">
                      {reviews.length > 0 ? (
                        reviews.map((review) => (
                          // Kita akan buat komponen ReviewItem di langkah berikutnya
                          <ReviewItem key={review.id} review={review} />
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <GoStar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>
                            No reviews yet. Be the first to review this book!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GoStar className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">Rating</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {rating}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GoBook className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Pages</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {book.pageCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GoHeart className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-600">Reviews</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {reviews.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Details */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Book Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium text-gray-900">
                      {book.category}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium text-gray-900">
                      {book.language}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Added</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(book.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-3">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isFavorited
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <GoHeart
                      className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
                    />
                    {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                  </button>
                  <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                    Read Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
