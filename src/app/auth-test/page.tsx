"use client";
import { useSession } from "next-auth/react";

export default function AuthTestPage() {
  const { data: session, status } = useSession();

  return (
    <main className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4">Authentication Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Session Status:</h2>
          <p className="text-gray-600">{status}</p>
        </div>

        {session && (
          <div>
            <h2 className="font-semibold">Session Data:</h2>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}

        {session?.user?.email && (
          <div>
            <h2 className="font-semibold">User Email:</h2>
            <p className="text-gray-600">{session.user.email}</p>
          </div>
        )}

        <div className="mt-4 p-4 bg-yellow-50 rounded">
          <h2 className="font-semibold text-yellow-800">Testing Instructions:</h2>
          <ol className="list-decimal ml-4 mt-2 space-y-2 text-yellow-800">
            <li>Try logging in with credentials</li>
            <li>Try logging in with Google</li>
            <li>Check if session persists after refresh</li>
            <li>Test logout functionality</li>
            <li>Verify protected route access</li>
          </ol>
        </div>
      </div>
    </main>
  );
} 