"use client";

import { Rating } from "@mantine/core";
import ReviewItem, { Review } from "./ReviewItem";

interface BookReviewListProps {
  reviews: Review[];
}

export default function BookReviewList({ reviews }: BookReviewListProps) {
  if (reviews.length === 0)
    return (
      <div className="py-4 text-center justify-center">
        <p className="text-gray-500">No reviews yet.</p>
      </div>
    );

  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Reviews ({reviews.length})
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Rating value={averageRating} readOnly fractions={4} defaultValue={3.75} />
          </div>
          <span className="text-sm text-gray-600">
            {averageRating.toFixed(1)} ({reviews.length} reviews)
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
