import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // pastikan path sesuai
import prisma  from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");

  if (!bookId) {
    return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { bookId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            email: true, // ✅ tambahkan ini
          },
        },
      },
    });

    const mapped = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      content: r.comment,
      user: {
        name: r.user?.name ?? "Anonymous",
        avatarUrl: r.user?.image ?? "",
        email: r.user?.email ?? "",
      },
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { bookId, rating, content } = await req.json();

  if (!bookId || !rating || rating < 1 || rating > 5 || !content) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Cek apakah user sudah pernah review buku ini
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { message: "You have already reviewed this book." },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        bookId,
        rating,
        comment: content,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
