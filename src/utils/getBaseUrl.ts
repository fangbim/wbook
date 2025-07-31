// utils/getBaseUrl.ts
export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // client-side
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR di Vercel
  return "http://localhost:3000"; // SSR di local dev
}
