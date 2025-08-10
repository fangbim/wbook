"use client";

import { useState } from "react";
import { Rating, Textarea } from "@mantine/core";

interface ReviewFormProps {
  onSubmit: (data: { rating: number; content: string }) => void;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && content.trim()) {
      onSubmit({ rating, content });
      setRating(0);
      setContent("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-6 space-y-4"
    >
      <h4 className="text-lg font-semibold text-gray-800">Write a Review</h4>

      {/* ⭐ Rating Selector */}
      <div className="flex items-center gap-1">
        <Rating value={rating} onChange={setRating} size="lg" />
      </div>

      {/* ✍️ Review Textarea */}
      <Textarea 
      rows={4}
      radius="md"
        placeholder="Write your review here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600 transition"
      >
        Submit Review
      </button>
    </form>
  );
}
