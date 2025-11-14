"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function TopBarControls() {
  const router = useRouter();

  const handleLogout = async () => {
    // Signs the user out and redirects to the sign-in page
    await signOut({ callbackUrl: "/signin" });
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <ThemeToggle />
      <button
        onClick={handleLogout}
        className="
          px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
          bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white
          hover:border-blue-600 dark:hover:border-blue-400
          hover:text-blue-600 dark:hover:text-blue-400
          transition
        "
      >
        Logout
      </button>
    </div>
  );
}
