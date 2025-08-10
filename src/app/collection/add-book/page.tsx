"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { normalizeISBN } from "@/utils/isbn";

type BookFormData = {
  title: string;
  category: string;
  authors: string;
  language: string;
  description: string;
  publisher: string;
  publishDate: string;
  pageCount: string;
  isbn: string;
  coverImage: File | null;
  coverImageUrl: string;
};

export default function AddBookPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    category: "",
    authors: "",
    language: "",
    description: "",
    publisher: "",
    publishDate: "",
    pageCount: "",
    isbn: "",
    coverImage: null,
    coverImageUrl: "",
  });

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 shadow-lg"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 bg-blue-50"></div>
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Authentication Required
          </h1>
          <p className="text-slate-600">
            Please sign in to add books to your library
          </p>
        </div>
      </div>
    );
  }

  async function uploadImageToSupabase(file: File) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `book-covers/${fileName}`;

    const { error } = await supabase.storage
      .from("book-covers") // <- pastikan bucket ini ada
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("book-covers").getPublicUrl(filePath);

    return publicUrl;
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (
      e.target instanceof HTMLInputElement &&
      e.target.files &&
      e.target.files[0]
    ) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        coverImage: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const url = e.target.value;
    setFormData((prev) => ({
      ...prev,
      coverImageUrl: url,
    }));
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      let coverUrl = formData.coverImageUrl;

      if (!coverUrl && formData.coverImage) {
        coverUrl = await uploadImageToSupabase(formData.coverImage);
      }

      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          authors: formData.authors,
          language: formData.language,
          description: formData.description,
          publisher: formData.publisher,
          publishDate: formData.publishDate,
          pageCount: parseInt(formData.pageCount),
          isbn: formData.isbn,
          coverImageUrl: coverUrl,
          category: formData.category,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save book");
      }

      setMessage("Book added successfully!");

      setFormData({
        title: "",
        category: "",
        authors: "",
        language: "",
        description: "",
        publisher: "",
        publishDate: "",
        pageCount: "",
        isbn: "",
        coverImage: null,
        coverImageUrl: "",
      });
      setImagePreview("");

      const fileInput = document.getElementById(
        "coverImageFile"
      ) as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error adding book:", error);
      setMessage(
        "Error adding book: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar
        user={{
          name: session.user?.name || undefined,
          avatarUrl: "/avatars/fajar.jpg",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
            Add New Book
          </h1>
          <p className="text-slate-600 text-lg">
            Create a new entry for your library
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className="mb-8 animate-in slide-in-from-top-2 duration-300">
            <div
              className={`p-4 rounded-2xl border backdrop-blur-sm ${
                message.includes("Error")
                  ? "bg-red-50/80 text-red-700 border-red-200 shadow-red-100/50"
                  : "bg-green-50/80 text-green-700 border-green-200 shadow-green-100/50"
              } shadow-lg`}
            >
              <div className="flex items-center gap-3">
                {message.includes("Error") ? (
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className="font-medium">{message}</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Image Upload Section */}
            <div className="xl:col-span-1">
              <div className="h-full bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sticky top-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">
                  Book Cover
                </h3>

                {/* Preview Container */}
                <div className="relative group">
                  <div className="aspect-[3/4] border-2 border-dashed border-slate-300 rounded-2xl p-4 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all duration-300">
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Cover preview"
                          className="w-full h-full object-contain rounded-xl shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl"></div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="font-medium text-slate-700">
                          Book Cover Preview
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Upload or paste URL
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Options */}
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Upload Image
                    </label>
                    <div className="relative">
                      <input
                        id="coverImageFile"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-slate-500">or</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="coverImageUrl"
                      value={formData.coverImageUrl}
                      onChange={handleImageUrlChange}
                      placeholder="https://example.com/book-cover.jpg"
                      className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="xl:col-span-2">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-6">
                  Book Details
                </h3>

                <div className="space-y-6">
                  {/* Title */}
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Book Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-lg font-medium group-hover:border-slate-300"
                      placeholder="Enter the book title"
                    />
                  </div>

                  {/* Category */}
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-lg font-medium group-hover:border-slate-300"
                      placeholder="Enter the book title"
                    />
                  </div>

                  {/* Authors */}
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Authors <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="authors"
                      value={formData.authors}
                      onChange={handleInputChange}
                      required
                      className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:border-slate-300"
                      placeholder="Enter author names"
                    />
                  </div>

                  {/* Language */}
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Language
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:border-slate-300"
                    >
                      <option value="">Select Language</option>
                      <option value="English">English</option>
                      <option value="Indonesian">Indonesian</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:border-slate-300"
                      placeholder="Enter book description"
                    />
                  </div>

                  {/* Publisher and Publish Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Publisher
                      </label>
                      <input
                        type="text"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:border-slate-300"
                        placeholder="Publisher name"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Publish Date
                      </label>
                      <input
                        type="date"
                        name="publishDate"
                        value={formData.publishDate}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:border-slate-300"
                      />
                    </div>
                  </div>

                  {/* pageCount and ISBN */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Pages
                      </label>
                      <input
                        type="number"
                        name="pageCount"
                        value={formData.pageCount}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:border-slate-300"
                        placeholder="Number of pageCount"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        ISBN
                      </label>
                      <input
                        type="text"
                        name="isbn"
                        value={normalizeISBN(formData.isbn)}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:border-slate-300"
                        placeholder="ISBN number"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="pt-6 flex justify-center md:justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full md:w-auto px-8 py-4 bg-[#03C988] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving Book...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Save Book
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
