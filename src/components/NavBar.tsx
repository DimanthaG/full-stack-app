"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow p-4">
      <nav className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex gap-4">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          {session && <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>}
        </div>
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <span>Loading...</span>
          ) : session ? (
            <>
              <span className="text-sm text-gray-700">{session.user?.email}</span>
              <button
                className="text-blue-600 hover:text-blue-800 underline"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-blue-600 hover:text-blue-800">
                Login
              </Link>
              <Link href="/register" className="text-blue-600 hover:text-blue-800">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
} 