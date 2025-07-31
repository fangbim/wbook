import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";


export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userBooks = await prisma.userBook.findMany({
      where: { userId: session.user.id },
      include: {
        book: true,
      },
      orderBy: {
        book: {
          title: "asc",
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: userBooks.map((entry) => ({
        id: entry.book.id,
        title: entry.book.title,
        author: entry.book.author,
        coverUrl: entry.book.coverUrl,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch user books:", error);
    return NextResponse.json({ success: false, message: "Error fetching books" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user?.email;
  const body = await req.json();
  console.log("Body:", body);

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail! },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // 1. Cek dan buat buku jika belum ada
    const existingBook = await prisma.book.findUnique({
      where: { id: body.id },
    });

    if (!existingBook) {
      await prisma.book.create({
        data: {
          id: body.id,
          title: body.title,
          author: Array.isArray(body.author) ? body.author.join(", ") : body.author || "Tidak Diketahui",
          coverUrl: body.coverUrl || null,
          isbn: Array.isArray(body.isbn) ? body.isbn[0] : body.isbn || null,
          publisher: Array.isArray(body.publishers) ? body.publishers[0] : body.publishers || null,
          description: null,
          category: null,
          language: null,
          pageCount: null,
          publishedAt: body.publishYear
            ? new Date(`${body.publishYear}-01-01`)
            : null,
        },
      });
    }

    // 2. Cek apakah user sudah punya buku ini
    const existingUserBook = await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId: body.id,
        },
      },
    });

    if (existingUserBook) {
      return NextResponse.json({
        success: false,
        message: "Buku sudah ada di koleksi kamu",
      });
    }

    // 3. Tambahkan ke koleksi user
    await prisma.userBook.create({
      data: {
        userId: user.id,
        bookId: body.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error adding book to user:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user?.email;
  const { bookId } = await req.json();

  if (!bookId) {
    return NextResponse.json({ success: false, message: "bookId is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail! },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const deleted = await prisma.userBook.delete({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId: bookId,
        },
      },
    });

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("❌ Error deleting book:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { bookId, status, progress } = await req.json();

  if (!bookId) {
    return NextResponse.json({ success: false, message: "bookId is required" }, { status: 400 });
  }

  try {
    const updated = await prisma.userBook.update({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      data: {
        ...(status && { status }),
        ...(typeof progress === "number" && { progress }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("❌ Error updating userBook:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}





