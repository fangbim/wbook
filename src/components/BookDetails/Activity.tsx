import { HiOutlineBookOpen } from "react-icons/hi";
import { LuQuote } from "react-icons/lu";

interface ActivityProps {
  totalQuotes: number;
  totalFlashcards: number;
}

export default function Activity({ totalQuotes, totalFlashcards }: ActivityProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">My Activity</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <LuQuote className="w-6 h-6 text-[#1C82AD]/80 mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#1C82AD]">{totalQuotes}</p>
          <p className="text-sm text-gray-600">Quotes</p>
        </div>

        <div className="text-center p-3 bg-green-50 rounded-lg">
          <HiOutlineBookOpen className="w-6 h-6 text-[#03C988]/80 mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#03C988]">
            {totalFlashcards}
          </p>
          <p className="text-sm text-gray-600">Flashcards</p>
        </div>
      </div>
    </div>
  );
}
