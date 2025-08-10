// app/book/[id]/page.tsx
import { notFound } from "next/navigation";
import UserBookDetailClient from "./UserBookDetailClient"; // Client Component baru
import { Metadata } from "next";
import { getBookById, getUserBook } from "@/lib/book";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const book = await getBookById((await params).id);
  if (!book) return notFound();

  let userBookRaw = null;
  if (userId) {
    userBookRaw = await getUserBook((await params).id, userId);
  }

  const userBook = userBookRaw
    ? {
        status: userBookRaw.status ?? "",
        progress: userBookRaw.progress ?? 0,
        addedAt:
          userBookRaw.addedAt instanceof Date
            ? userBookRaw.addedAt.toISOString()
            : userBookRaw.addedAt,
      }
    : {
        status: "",
        progress: 0,
        addedAt: "",
      };

  const bookForClient = {
    ...book,
    category: book.category ?? "",
    language: book.language ?? "",
    publisher: book.publisher ?? "",
    publishedAt: book.publishedAt ? book.publishedAt.toISOString() : "",
    pageCount: book.pageCount ?? 0,
    isbn: book.isbn ?? "",
    description: book.description ?? "",
    createdAt: book.createdAt.toISOString(),
    id: book.id,
    coverUrl: book.coverUrl ?? undefined,
  };

  return <UserBookDetailClient book={bookForClient} userbook={userBook} />;
}

