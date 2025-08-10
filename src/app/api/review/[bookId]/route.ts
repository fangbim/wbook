import { NextResponse } from "next/server";
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
      },
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}