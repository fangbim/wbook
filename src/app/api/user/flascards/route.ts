// app/api/user/quotes/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { bookId, front, back } = await req.json();
  

  if (!bookId || !front || !back) {
    return NextResponse.json({ success: false, message: "bookId and content are required" }, { status: 400 });
  }

  try {
    // Ambil relasi UserBook
    const userBook = await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (!userBook) {
      return NextResponse.json({ success: false, message: "Book not found in your collection" }, { status: 404 });
    }

    // Buat Quote baru
    const quote = await prisma.flashcard.create({
      data: {
        userBookId: userBook.id,
        front: front,
        back: back,
      },
    });

    return NextResponse.json({ success: true, data: quote });
  } catch (error) {
    console.error("❌ Error adding quote:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
