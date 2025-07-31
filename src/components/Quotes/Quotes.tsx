import React, { useState } from "react";
import { BsChatQuote } from "react-icons/bs";
import { FiEdit2, FiTrash2, FiBookOpen, FiHeart, FiCopy } from "react-icons/fi";
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuQuote } from "react-icons/lu";

interface Quote {
  id: string;
  content: string;
  page?: string;
  category?: string;
  isFavorite?: boolean;
  dateAdded?: Date;
}

interface QuotesProps {
  quotes: Quote[];
  currentPage: number;
  limit: number;
  setQuoteModalOpened: (open: boolean) => void;
  handleEditQuote: (quoteId: string, content: string, page?: string) => void;
  handleDeleteQuote: (quoteId: string) => void;
}

export default function Quotes({
  quotes,
  currentPage,
  limit,
  setQuoteModalOpened = () => {},
  handleEditQuote = () => {},
  handleDeleteQuote = () => {}
}: QuotesProps) {
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const categories = ['all', ...Array.from(new Set(quotes.map(q => q.category).filter(Boolean)))];
  
  const filteredQuotes = quotes.filter(quote => {
    const categoryMatch = filterCategory === 'all' || quote.category === filterCategory;
    const favoriteMatch = !showFavoritesOnly || quote.isFavorite;
    return categoryMatch && favoriteMatch;
  });

  const handleCopyQuote = async (content: string) => {
    try {
      await navigator.clipboard.writeText(`"${content}"`);
      // In real app, you'd show a toast notification
      alert('Quote copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy quote:', err);
    }
  };

  const handleToggleFavorite = (quoteId: string) => {
    // In real implementation, you'd update the quote's favorite status
    console.log('Toggle favorite for quote:', quoteId);
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Motivation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Philosophy': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Success': return 'bg-green-100 text-green-800 border-green-200';
      case 'Life': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Love': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1C82AD] rounded-lg">
            <BsChatQuote className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">My Quotes</h3>
            <p className="text-sm text-gray-600">{filteredQuotes.length} quotes collected</p>
          </div>
        </div>
        
        <button
          onClick={() => setQuoteModalOpened(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1C82AD] text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl"
        >
          <HiOutlinePlusSm className="w-4 h-4" />
          Add Quote
        </button>
      </div>

      {quotes.length > 0 ? (
        <>
          {/* Filters and View Toggle */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Category:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C82AD]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Favorites Toggle */}
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                  showFavoritesOnly 
                    ? 'bg-pink-100 text-pink-700 border border-pink-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiHeart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                Favorites Only
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Quotes Grid/List */}
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
            {filteredQuotes.map((quote, index) => (
              <div
                key={quote.id}
                className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Quote Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1C82AD] rounded-lg flex items-center justify-center text-white font-medium text-sm">
                       {(currentPage - 1) * limit + index + 1}
                      </div>
                      {quote.category && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(quote.category)}`}>
                          {quote.category}
                        </span>
                      )}
                      {quote.isFavorite && (
                        <FiHeart className="w-4 h-4 text-red-500 fill-current" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleFavorite(quote.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          quote.isFavorite 
                            ? 'text-red-500 hover:bg-red-50' 
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                        aria-label="Toggle favorite"
                      >
                        <FiHeart className={`w-4 h-4 ${quote.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleCopyQuote(quote.content)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Copy quote"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditQuote(quote.id, quote.content, quote.page)}
                        className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                        aria-label="Edit quote"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuote(quote.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete quote"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quote Content */}
                <div className="p-4">
                  {/* Quote Icon */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 mt-1">
                      <LuQuote className="w-6 h-6 text-[#1C82AD]/60" />
                    </div>
                    <div className="flex-1">
                      <blockquote
                        className={`text-gray-800 italic text-lg leading-relaxed ${
                          expandedQuoteId === quote.id
                            ? ""
                            : "line-clamp-4 overflow-hidden"
                        }`}
                      >
                        &ldquo;{quote.content}&rdquo;
                      </blockquote>
                      
                      { quote.content.length > 250 && (
                        <button
                          onClick={() =>
                            setExpandedQuoteId(
                              expandedQuoteId === quote.id ? null : quote.id
                            )
                          }
                          className="mt-2 text-sm text-pink-600 hover:text-pink-700 hover:underline font-medium"
                        >
                          {expandedQuoteId === quote.id ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quote Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiBookOpen className="w-4 h-4" />
                      <span>Page {quote.page || 'Unknown'}</span>
                    </div>
                    {quote.dateAdded && (
                      <div className="text-xs text-gray-500">
                        Added {quote.dateAdded.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Gradient Border Effect */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-[#1C82AD] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            ))}
          </div>

          {/* No Results State */}
          {filteredQuotes.length === 0 && (
            <div className="text-center py-12">
              <BsChatQuote className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                No quotes match your filters
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Try adjusting your category or favorite filters.
              </p>
              <button
                onClick={() => {
                  setFilterCategory('all');
                  setShowFavoritesOnly(false);
                }}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center border-2 border-dashed border-gray-300 rounded-2xl p-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-sm mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#1C82AD] rounded-2xl flex items-center justify-center">
              <BsChatQuote className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">
              No Quotes Yet
            </h4>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Start building your collection of inspiring quotes! Click the &ldquo;Add Quote&rdquo; button to save your favorite passages and wisdom.
            </p>
            <button
              onClick={() => setQuoteModalOpened(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C82AD] text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <HiOutlinePlusSm className="w-5 h-5" />
              Add Your First Quote
            </button>
          </div>
        </div>
      )}
    </div>
  );
}