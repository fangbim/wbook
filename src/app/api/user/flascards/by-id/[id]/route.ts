import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const flashcardId = (await params).id;

  try {
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
      include: {
        userBook: {
          select: { userId: true },
        },
      },
    });

    if (!flashcard || flashcard.userBook.userId !== session.user.id) {
      return NextResponse.json({ success: false, message: "Not found or access denied" }, { status: 403 });
    }

    await prisma.flashcard.delete({ where: { id: flashcardId } });

    return NextResponse.json({ success: true, message: "Flashcard deleted" });
  } catch (error) {
    console.error("❌ Error deleting flashcard:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}