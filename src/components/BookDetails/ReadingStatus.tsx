import { Book, UserBook } from "@/schemas/book";
import { Slider } from "@mantine/core";
import { useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { FaClock, FaRegCheckCircle } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";

const BookOpen = () => <HiOutlineBookOpen className="w-4 h-4" />;
const Bookmark = () => <CiBookmark className="w-4 h-4" />;
const CheckCircle = () => <FaRegCheckCircle className="w-4 h-4" />;
const Clock = () => <FaClock className="w-4 h-4" />;

const statusOptions = [
  {
    value: "Want to Read",
    label: "Want to Read",
    icon: Bookmark,
    color: "bg-blue-500",
  },
  {
    value: "Reading",
    label: "Currently Reading",
    icon: BookOpen,
    color: "bg-green-500",
  },
  {
    value: "Completed",
    label: "Completed",
    icon: CheckCircle,
    color: "bg-purple-500",
  },
  { value: "Paused", label: "Paused", icon: Clock, color: "bg-orange-500" },
];

interface ReadingStatusProps {
  userBook?: UserBook;
  book: Book;
}

export default function ReadingStatus({ userBook, book }: ReadingStatusProps) {
  const [readingStatus, setReadingStatus] = useState(
    userBook?.status || "want-to-read"
  );
  const [progress, setProgress] = useState(userBook?.progress || 0);

  const currentStatus = statusOptions.find((s) => s.value === readingStatus);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    setReadingStatus(newStatus);

    try {
      const res = await fetch("/api/user/books", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
    } catch (err) {
      console.error("❌ Failed to update status", err);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Reading Status</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${currentStatus?.color}`} />
          <span className="font-medium">{readingStatus}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          {/* === Slider === */}
          <Slider
            color="indigo"
            size="lg"
            defaultValue={progress}
            onChange={setProgress}
            onChangeEnd={async (value: number) => {
              setProgress(value);
              try {
                const res = await fetch("/api/user/books", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    bookId: book.id,
                    progress: value,
                  }),
                });
                if (!res.ok) throw new Error("Failed to update progress");
                console.log("✅ Progress updated");
              } catch (err) {
                console.error("❌ Failed to update progress", err);
              }
            }}
          />

          <p className="text-xs text-gray-500">
            {Math.round((progress / 100) * book.pageCount)} of {book.pageCount}{" "}
            pages
          </p>
        </div>

        <div className="pt-4 border-t">
          <label className="block text-sm font-medium mb-2">
            Update Status
          </label>
          <select
            value={readingStatus}
            onChange={handleStatusChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
