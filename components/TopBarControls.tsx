"use client";

import { signOut, useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import SettingsMenu from "./SettingsMenu";

export default function TopBarControls() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {/* Always visible */}
      <ThemeToggle />

      {/* Only show when logged in */}
      {session && <SettingsMenu onLogout={handleLogout} />}
    </div>
  );
}
