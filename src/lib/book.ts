import prisma  from "@/lib/prisma";

export async function getBookById(id : string) {

    const book  = await prisma.book.findUnique({
        where: { id }
    });
    return book;
}

export async function getUserBook(bookId: string, userId: string) {
  // Pastikan userId tidak kosong sebelum melakukan query
  if (!userId) {
    return null;
  }
  
  try {
    const userBook = await prisma.userBook.findUnique({
      where: {
        userId_bookId: { // Ini adalah contoh composite key
          userId: userId,
          bookId: bookId,
        },
      },
    });
    return userBook;
  } catch (error) {
    console.error("Error fetching user book:", error);
    return null;
  }
}