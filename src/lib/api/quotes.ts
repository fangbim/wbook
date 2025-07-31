interface NewQuote {
  content: string;
  page?: string;
}

export const addQuote = async (bookId: string, quote: NewQuote) => {
  const res = await fetch("/api/user/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, ...quote }),
  });
  return res.json();
};

export const editQuote = async (quoteId: string, updatedContent: string, updatedPage: number) => {
  const res = await fetch(`/api/user/quotes/by-id/${quoteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: updatedContent, page: updatedPage }),
  });
  return res.json();
};

export const deleteQuote = async (quoteId: string) => {
  const res = await fetch(`/api/user/quotes/by-id/${quoteId}`, {
    method: "DELETE",
  });
  return res.json().catch(() => null); // in case of empty response
};

export const fetchQuotesByBook = async (bookId: string, page = 1, limit = 4) => {
  const res = await fetch(`/api/user/quotes/${bookId}?page=${page}&limit=${limit}`);
  return res.json();
};
