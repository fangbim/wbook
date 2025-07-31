import { hyphenate, parse } from "isbn3";

/**
 * Menghapus tanda hubung dari ISBN
 */
export function normalizeISBN(isbn: string): string {
  return isbn.replace(/-/g, "").trim();
}

/**
 * Format ISBN-13 dengan tanda hubung jika valid, jika tidak return original
 */
export function formatISBN(isbn: string): string {
  const clean = normalizeISBN(isbn);
  const parsed = parse(clean);
  return hyphenate(parsed?.isbn13 || clean);
}
