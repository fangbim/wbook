"use client";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { GoEye, GoBook, GoStar, GoHeart, GoHeartFill } from "react-icons/go";
import { GiOpenBook } from "react-icons/gi";
import BookHeader from "@/components/BookDetails/BookHeader";
import BookOverview from "@/components/BookDetails/BookOverview";
import { useEffect, useState } from "react";
import { formatISBN } from "@/utils/isbn";
import { Book } from "@/schemas/book";

import ReviewForm from "../ReviewForm";
import BookReviewList from "../BookReviewList";
import { FaStar } from "react-icons/fa6";

interface BookDetailClientProps {
  book: Book;
}

export default function BookDetailClient({ book }: BookDetailClientProps) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const checkUserReview = async () => {
      if (!session?.user?.email || !book.id) return;

      try {
        const res = await fetch(`/api/review/has-reviewed?bookId=${book.id}`);
        const data = await res.json();
        setHasReviewed(data.hasReviewed);
      } catch (error) {
        console.error("Failed to check review status", error);
      }
    };

    checkUserReview();
  }, [session, book.id]);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState<number>(0);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/review?bookId=${book.id}`);
      const data = await res.json();
      setReviews(data);

      if (data.length > 0) {
        const total = data.reduce(
          (acc: number, review: { rating: number }) => acc + review.rating,
          0
        );
        const avg = total / data.length;
        setAverageRating(Number(avg.toFixed(1)));
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [book.id]);

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

  const handleSubmitReview = async ({
    rating,
    content,
  }: {
    rating: number;
    content: string;
  }) => {
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book.id,
          rating,
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      await fetchReviews();
      setHasReviewed(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred.");
      }
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

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
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
                <nav className="flex flex text-xs md:text-md" role="tablist">
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
                      <tab.icon />
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
                    {session?.user ? (
                      hasReviewed ? (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
                          <p className="text-sm">
                            Thank you for your review! Your feedback helps
                            others discover this book. 😊
                          </p>
                        </div>
                      ) : (
                        <ReviewForm onSubmit={handleSubmitReview} />
                      )
                    ) : (
                      <div className="text-center justify-center">
                      <p className="text-sm text-gray-600">
                        You must be logged in to submit a review.
                      </p>
                      </div>
                    )}
                    <div className="space-y-6">
                      <BookReviewList reviews={reviews} />
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
                      <FaStar className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">Rating</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {averageRating}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GiOpenBook className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Pages</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {book.pageCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GoHeartFill className="w-4 h-4 text-red-500" />
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
