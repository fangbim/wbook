// app/api/user/quotes/[bookId]/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const bookId = (await params).bookId;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const skip = (page - 1) * limit;

  try {
    const userBook = await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      include: {
        flashcards: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!userBook) {
      return NextResponse.json({ success: false, message: "Book not found in your collection" }, { status: 404 });
    }

    const totalFlashcards = await prisma.flashcard.count({
      where: {
        userBook: {
          is: {
            userId,
            bookId,
          },
        },
      },
    });

    const flashcard = await prisma.flashcard.findMany({
      where: {
        userBook: {
          is: {
            userId,
            bookId,
          },
        },
      },
      orderBy: { createdAt: "asc" }, skip, take: limit,
    });

    return NextResponse.json({ 
      success: true, 
      data: flashcard, 
      pagination: {
        totalItems: totalFlashcards,
        totalPages: Math.ceil(totalFlashcards / limit),
        limit,
        currentPage: page,
      }
    });
  } catch (error) {
    console.error("❌ Error fetching quotes:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

