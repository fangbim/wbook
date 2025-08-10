import { Avatar, Rating } from "@mantine/core";
export type Review = {
  id: string;
  user: { name: string; avatarUrl: string };
  rating: number;
  content: string;
};

// Komponen untuk satu item review
export default function ReviewItem({ review }: { review: Review }) {
  
  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-start gap-4">
        {/* Avatar Pengguna */}
        {review.user.avatarUrl ? (
          <Avatar src={review.user.avatarUrl} alt={review.user.name} /> ): (
             <Avatar color="cyan" radius="xl">{review.user.name.charAt(0)}</Avatar>
          )
        }
        <div className="flex-1">
          {/* Nama dan Rating */}
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-800">{review.user.name}</p>
            <div className="flex items-center">
              <Rating value={review.rating} readOnly />
            </div>
          </div>
          {/* Konten Review */}
          <p className="mt-2 text-gray-600 leading-relaxed">
            {review.content}
          </p>
        </div>
      </div>
    </div>
  );
}