"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  const [username, setUsername] = useState(""); // change from email to username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      // Successful login → redirect to dashboard
      window.location.href = "/dashboard";
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950 text-black dark:text-white">
      <div className="w-full max-w-md p-8 bg-gray-100 dark:bg-gray-900 text-black dark:text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
            required
          />

          <button
            type="submit"
            className="bg-white dark:bg-gray-800 text-black dark:text-white py-3 px-6 rounded font-semibold hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {error && (
            <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
          )}
        </form>
      </div>
    </main>
  );
}
