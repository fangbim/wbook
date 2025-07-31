import { useState } from "react";
import { BsChatQuote } from "react-icons/bs";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuQuote } from "react-icons/lu";

interface Quote {
  id: string;
  content: string;
  page?: string;
}

interface QuotesProps {
  quotes: Quote[];
  setQuoteModalOpened: (open: boolean) => void;
  handleEditQuote: (quoteId: string, content: string) => void;
  handleDeleteQuote: (quoteId: string) => void;
}

export default function Quotes({
  quotes,
  setQuoteModalOpened,
  handleEditQuote,
  handleDeleteQuote,
}: QuotesProps) {
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">My Quotes</h3>
        <button
          onClick={() => setQuoteModalOpened(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <HiOutlinePlusSm className="w-5 h-5" />
          <span className="text-sm font-medium">Add Quote</span>
        </button>
      </div>

      {/* Conditional Rendering: Show quotes or empty state */}

      {quotes.length > 0 ? (
        // Grid layout for quotes
        <div className="grid grid-cols-1 gap-6 pb-14">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="relative bg-white border-l-4 border-blue-500 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Action Buttons: Appear on hover for a cleaner look */}
              <div
                className="absolute top-4 right-4 flex items-center space-x-3
                    opacity-100 transition-opacity duration-300
                    group-hover:opacity-100
                    hover:opacity-100
                    [@media(hover:hover)]:opacity-0
                    [@media(hover:hover)]:group-hover:opacity-100"
              >
                <button
                  className="text-gray-400 hover:text-blue-600"
                  aria-label="Edit quote"
                  onClick={() => handleEditQuote(quote.id, quote.content)}
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  className="text-gray-400 hover:text-red-600"
                  aria-label="Delete quote"
                  onClick={() => handleDeleteQuote(quote.id)}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

              <LuQuote className="w-8 h-8 text-blue-200 mb-4" />
              <p
                className={`text-gray-700 italic text-lg mb-2 break-words whitespace-pre-wrap ${
                  expandedQuoteId === quote.id
                    ? ""
                    : "line-clamp-3 overflow-hidden"
                }`}
              >
                “{quote.content}”
              </p>

              {quote.content.length > 250 && (
                <button
                  onClick={() =>
                    setExpandedQuoteId(
                      expandedQuoteId === quote.id ? null : quote.id
                    )
                  }
                  className="text-sm text-blue-500 hover:underline"
                >
                  {expandedQuoteId === quote.id ? "Show less" : "Read more"}
                </button>
              )}
              <p className="text-right text-sm font-semibold text-gray-500">
                — Page {quote.page}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-12 mt-4">
          <BsChatQuote className="mx-auto h-12 w-12 text-gray-400" />
          <h4 className="mt-4 text-lg font-semibold text-gray-800">
            No Quotes Yet
          </h4>
          <p className="mt-2 text-sm text-gray-500">
            Click the &ldquo;Add Quote&ldquo; button to save your favorite
            passages.
          </p>
        </div>
      )}
    </div>
  );
}
