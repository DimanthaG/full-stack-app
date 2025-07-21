"use client";
import { useSession } from "next-auth/react";
import AdminOnly from "@/components/AdminOnly";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <main className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Regular content visible to all authenticated users */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        <p>Welcome back, {session?.user?.email}</p>
      </section>

      {/* Admin-only section */}
      <AdminOnly>
        <section className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
          <p>This section is only visible to administrators.</p>
          <div className="mt-4 space-x-2">
            <Link href="/admin/users" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Manage Users
            </Link>
            <Link href="/admin/settings" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              System Settings
            </Link>
          </div>
        </section>
      </AdminOnly>
    </main>
  );
} 