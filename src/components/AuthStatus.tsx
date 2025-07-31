// components/AuthStatus.tsx
"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center gap-4">
      {session ? (
        <>
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span>{session.user?.name}</span>
          <button
            onClick={() => signOut()}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </>
      ) : (
        <Link
          href="/auth/signin"
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}