// /app/api/review/has-reviewed/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // pastikan ini sesuai path auth kamu
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");

  if (!session?.user?.email) {
    return NextResponse.json({ hasReviewed: false });
  }

  if (!bookId) {
    return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
  }

  try {
    const review = await prisma.review.findFirst({
      where: {
        bookId,
        user: { email: session.user.email },
      },
    });

    return NextResponse.json({ hasReviewed: !!review });
  } catch (error) {
    console.error("Error checking review:", error);
    return NextResponse.json({ hasReviewed: false }, { status: 500 });
  }
}
