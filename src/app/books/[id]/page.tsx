// app/book/[id]/page.tsx
import { notFound } from "next/navigation";
import BookDetailClient from "./BookDetailClient"; // Client Component baru
import { Metadata } from "next";
import { getBookById } from "@/lib/book";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const book = await getBookById((await params).id);

  if (!book) {
    return {
      title: "Book Not Found",
      description: "The requested book could not be found.",
    };
  }

  return {
    title: `${book.title} - WBook`,
    description: book.description || "Detail buku yang tersedia di WBook.",
    openGraph: {
      title: `${book.title} - WBook`,
      description: book.description || "Detail buku yang tersedia di WBook.",
      images: [
        {
          url: book.coverUrl || "/default-cover.png",
          width: 800,
          height: 600,
          alt: `Cover of ${book.title}`,
        },
      ],
    },
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;  
}) {
  const  paramsId = (await params).id;

  const book = await getBookById(paramsId);
  if (!book) return notFound();

  const safeBook = {
    id: book.id,
    title: book.title ?? "",
    author: book.author ?? "",
    category: book.category ?? "",
    language: book.language ?? "",
    publisher: book.publisher ?? "",
    publishedAt: book.publishedAt ? book.publishedAt.toISOString() : "",
    pageCount: book.pageCount ?? 0,
    isbn: book.isbn ?? "",
    description: book.description ?? "",
    createdAt: book.createdAt ? book.createdAt.toISOString() : "",
    coverUrl: book.coverUrl ?? undefined,
  };

  return <BookDetailClient book={safeBook} />;
}

