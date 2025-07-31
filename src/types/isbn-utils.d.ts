declare module 'isbn-utils' {
  export interface ParsedISBN {
    asIsbn13(hyphenated: boolean): string;
    asIsbn10(hyphenated: boolean): string;
  }

  export class ISBN {
    static parse(isbn: string): ParsedISBN | null;
  }
}
