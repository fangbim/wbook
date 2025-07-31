// /app/collection/page.tsx

import { getServerSession } from "next-auth";
import CollectionsClient from "./CollectionsClient";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: 'Collections - WBook',
  description: 'This is the collections page of WBook.',
};


export default async function CollectionPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return ("/signin"); // from "next/navigation"
  }
  return <CollectionsClient />;
}
