// API only - tidak ada alert, tidak ada confirm

export const deleteUserBook = async (bookId: string) => {
  const res = await fetch("/api/user/books", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId }),
  });

  const result = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result.message || "Gagal menghapus buku.");
  }

  return result;
};

export const updateUserBookStatus = async (bookId: string, status: string) => {
  const res = await fetch("/api/user/books", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, status }),
  });

  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};

export const updateUserProgress = async (bookId: string, progress: number) => {
  const res = await fetch("/api/user/books/progress", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, progress }),
  });

  if (!res.ok) throw new Error("Failed to update progress");
  return res.json();
}


