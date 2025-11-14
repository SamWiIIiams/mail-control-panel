"use client";

import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors duration-300 flex items-center p-1"
      aria-label="Toggle theme"
    >
      {/* Sun icon on left */}
      <span className="absolute left-2 text-yellow-500 dark:text-yellow-300">
        <Sun size={16} />
      </span>

      {/* Moon icon on right */}
      <span className="absolute right-2 text-blue-500 dark:text-blue-300">
        <Moon size={16} />
      </span>

      {/* Sliding circle */}
      <span
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          theme === "dark" ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
