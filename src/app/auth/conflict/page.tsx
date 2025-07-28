"use client";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense } from "react";

function ConflictResolutionContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const provider = searchParams.get("provider");

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4">Account Already Exists</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
        <p className="text-yellow-800">
          An account with the email <strong>{email}</strong> already exists using a different sign-in method.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">
          Please sign in using your existing account method, or contact support if you need help accessing your account.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => signIn("credentials")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Sign in with Email/Password
          </button>
          
          <button
            onClick={() => signIn("google")}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Sign in with Google
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          For security reasons, we cannot automatically merge accounts. Please use your original sign-in method.
        </p>
      </div>
    </main>
  );
}

export default function ConflictResolutionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConflictResolutionContent />
    </Suspense>
  );
} 