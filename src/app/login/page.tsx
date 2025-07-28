"use client";
<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
=======
import { useState } from "react";
import { useRouter } from "next/navigation";
>>>>>>> fb06a72da8b32eb9f1be117f1eff65c957368f5b
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
<<<<<<< HEAD
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show success message if redirected from registration
    if (searchParams?.get("registered")) {
      setSuccess("Registration successful! Please sign in.");
    }
    // Show success message if account was merged
    else if (searchParams?.get("merged")) {
      setSuccess("Account linked successfully! You can now sign in with either email/password or Google.");
    }
  }, [searchParams]);
=======
  const [loading, setLoading] = useState(false);
  const router = useRouter();
>>>>>>> fb06a72da8b32eb9f1be117f1eff65c957368f5b

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
<<<<<<< HEAD
    setSuccess("");
=======
>>>>>>> fb06a72da8b32eb9f1be117f1eff65c957368f5b
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (res?.error) {
<<<<<<< HEAD
        if (res.error === "Please sign in with Google") {
          setError("This email is registered with Google. Please use the Google sign-in button below.");
        } else {
          setError("Invalid email or password");
        }
=======
        setError("Invalid email or password");
>>>>>>> fb06a72da8b32eb9f1be117f1eff65c957368f5b
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
<<<<<<< HEAD
      
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-600 rounded-md p-3">
          {success}
        </div>
      )}

=======
>>>>>>> fb06a72da8b32eb9f1be117f1eff65c957368f5b
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
<<<<<<< HEAD
            placeholder="Enter your email"
=======
            placeholder="Enter your email address"
>>>>>>> fb06a72da8b32eb9f1be117f1eff65c957368f5b
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="text-center">
          <Link 
            href="/reset-password" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Forgot your password?
          </Link>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="mt-4 w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-800">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
} 