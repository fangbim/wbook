// app/api/user/quotes/[id]/route.ts

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { content, page } = await req.json();
  const quoteId = (await params).id;

  try {
    // Validasi kepemilikan quote
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        userBook: {
          select: { userId: true },
        },
      },
    });

    if (!quote || quote.userBook.userId !== session.user.id) {
      return NextResponse.json({ success: false, message: "Not found or access denied" }, { status: 403 });
    }

    const updated = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        content,
        page: page ? parseInt(page) : null,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("❌ Error updating quote:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const quoteId = (await params).id;

  try {
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        userBook: {
          select: { userId: true },
        },
      },
    });

    if (!quote || quote.userBook.userId !== session.user.id) {
      return NextResponse.json({ success: false, message: "Not found or access denied" }, { status: 403 });
    }

    await prisma.quote.delete({ where: { id: quoteId } });

    return NextResponse.json({ success: true, message: "Quote deleted" });
  } catch (error) {
    console.error("❌ Error deleting quote:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
