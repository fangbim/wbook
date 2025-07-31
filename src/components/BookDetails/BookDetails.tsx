import { Book, UserBook } from "@/schemas/book";


interface BookDetailProps {
  book: Book;
  userbook: UserBook;
}

export default function BookDetails({ book, userbook }: BookDetailProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Book Details</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-700">
          <span>Category</span>
          <span className="font-medium">{book.category}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <span>Pages</span>
          <span className="font-medium">{book.pageCount}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <span>Language</span>
          <span className="font-medium">{book.language}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <span>Added</span>
          <span className="font-medium">
            {new Date(userbook.addedAt).toLocaleDateString("en-US", {
              dateStyle: "long",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
