"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-6">Mail Dashboard</h1>
      <button
        onClick={() => router.push("/dashboard/new")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
      >
        New Email Blast
      </button>
    </div>
  );
}
