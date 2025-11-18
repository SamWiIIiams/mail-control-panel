"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

export default function SetupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resendApiKey, setResendApiKey] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password: hashedPassword,
          resendApiKey,
          fromEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Setup failed");
        return;
      }

      // Setup complete → redirect to sign-in
      router.push("/signin");
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-black">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-2xl p-8">
        <h1 className="text-2xl font-semibold mb-4 text-center">Initial Setup</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            Admin username
            <input className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" value={username} onChange={(e)=>setUsername(e.target.value)} required />
          </label>
          <label>
            Admin password
            <input type="password" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </label>
          <label>
            Resend API Key
            <input className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" value={resendApiKey} onChange={(e)=>setResendApiKey(e.target.value)} required placeholder="re_xxx"/>
          </label>
          <label>
            Default From Email (optional)
            <input className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" value={fromEmail} onChange={(e)=>setFromEmail(e.target.value)} />
          </label>

          {error && <p className="text-red-500">{error}</p>}
          <button disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg">
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
