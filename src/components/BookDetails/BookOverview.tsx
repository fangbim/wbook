import React, { useState } from "react";
import { CiGlobe } from "react-icons/ci";
import { FaRegBuilding } from "react-icons/fa6";
import { HiOutlineHashtag } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import { FiCopy} from "react-icons/fi";
import toast from "react-hot-toast";
import { formatISBN } from "@/utils/isbn";
import { Book } from "@/schemas/book";

export default function BookOverview({ 
  book
}: { book: Book }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const handleCopyISBN = async () => {
    try {
      await navigator.clipboard.writeText(book.isbn);
      toast('ISBN copied to clipboard!', {
        icon: '📋',
        style: {
          background: '#2C2C2C',
          color: '#fff',
        },
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy ISBN:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const bookDetails = [
    {
      icon: <FaRegBuilding className="w-5 h-5" />,
      label: "Publisher",
      value: book.publisher,
    },
    {
      icon: <SlCalender className="w-5 h-5" />,
      label: "Published",
      value: formatDate(book.publishedAt),
    },
    {
      icon: <CiGlobe className="w-5 h-5" />,
      label: "Language",
      value: book.language,
    },
    {
      icon: <HiOutlineHashtag className="w-5 h-5" />,
      label: "ISBN",
      value: formatISBN(book.isbn) || "Not available",
      action: handleCopyISBN,
      actionIcon: <FiCopy className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-8">

      {/* Description Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xl font-bold text-gray-900">Description</h3>
        </div>
        
        <div className="prose prose-gray max-w-none">
          <p
            className={`text-gray-700 leading-relaxed whitespace-pre-line ${
              !isDescriptionExpanded && book.description.length > 400
                ? 'line-clamp-6 overflow-hidden'
                : ''
            }`}
          >
            {book.description || "No description available."}
          </p>
          
          {book.description.length > 400 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
            >
              {isDescriptionExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      </div>

      {/* Book Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {bookDetails.map((item, i) => (
          <div
            key={i}
            className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
          >
            {/* Gradient Accent */}
            <div className={`absolute inset-x-0 top-0 h-1 bg-[#2C2C2C]`}></div>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 bg-[#2C2C2C] rounded-lg text-white`}>
                    {item.icon}
                  </div>
                  <span className="font-semibold text-gray-900">{item.label}</span>
                </div>
                <p className="text-gray-700 font-normal leading-relaxed">
                  {item.value}
                </p>
              </div>
              
              {item.action && (
                <button
                  onClick={item.action}
                  className="ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title={`Copy ${item.label}`}
                >
                  {item.actionIcon}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info Section */}
      {(book.author) && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {book.author && (
              <div>
                <span className="text-sm font-medium text-gray-600">Author</span>
                <p className="text-gray-900 font-medium">{book.author}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}