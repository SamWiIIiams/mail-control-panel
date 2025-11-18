"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import SettingsDrawer from "./SettingsDrawer";

export default function TopBarControls() {
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/signin" });
    setDrawerOpen(false);
  };

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {/* Always-visible theme toggle */}
        <ThemeToggle />

        {/* Hamburger menu only when signed in */}
        {session && (
          <button
            onClick={toggleDrawer}
            className="px-3 py-2 rounded border bg-gray-200 dark:bg-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-800 transition"
          >
            ☰
          </button>
        )}
      </div>

      {session && (
        <SettingsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onLogout={handleLogout} />
      )}
    </>
  );
}
