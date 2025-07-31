import { NextRequest, NextResponse } from 'next/server'
import prisma  from '@/lib/prisma'
import { Prisma } from "@prisma/client";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const general = searchParams.get("q")?.trim() || "";
  const title = searchParams.get("title")?.trim() || "";
  const author = searchParams.get("author")?.trim() || "";

  const conditions: Prisma.BookWhereInput[] = [];

  if (general) {
    conditions.push(
      { title: { contains: general, mode: "insensitive" } },
      { author: { contains: general, mode: "insensitive" } }
    );
  }

  if (title) {
    conditions.push({ title: { contains: title, mode: "insensitive" } });
  }

  if (author) {
    conditions.push({ author: { contains: author, mode: "insensitive" } });
  }

  const hasQuery = general || title || author;

  const books = await prisma.book.findMany({
    where: hasQuery ? { OR: conditions } : undefined,
    take: 12,
  });

  return NextResponse.json({ success: true, data: books });
}


// POST /api/books - Add a new book (not implemented in this example)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      category,
      authors,
      language,
      description,
      publisher,
      publishDate,
      pageCount,
      isbn,
      coverImageUrl,
      userId
    } = body;

    if (!userId || !title || !authors) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // 1. Buat atau ambil global book
    const book = await prisma.book.upsert({
      where: { isbn: isbn || "" },
      update: {},
      create: {
        coverUrl: coverImageUrl || undefined,
        title,
        category: category || "General",
        author: authors,
        language,
        description,
        publisher,
        pageCount,
        isbn,
        publishedAt: publishDate ? new Date(publishDate) : undefined,
        createdAt: new Date(),
        // kamu bisa tambahkan category, language, publisher, pages, coverImageUrl ke schema Book jika diperlukan
      },
    });

    // 2. Tambahkan ke koleksi user (jika belum)
    const existingUserBook = await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId: book.id,
        },
      },
    });

    if (!existingUserBook) {
      await prisma.userBook.create({
        data: {
          userId,
          bookId: book.id,
          status: "want to read",
          progress: 0,
        },
      });
    }

    return NextResponse.json({ success: true, book }, { status: 201 });

  } catch (error) {
    console.error("[BOOK_CREATE_ERROR]", error);
    return NextResponse.json({ success: false, message: "Failed to create book" }, { status: 500 });
  }
}

