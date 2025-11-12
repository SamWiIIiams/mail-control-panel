"use client";

import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Label */}
      <span className="text-sm text-black dark:text-white select-none">
        {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </span>

      {/* Toggle switch */}
      <button
        onClick={toggleTheme}
        className="relative w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors duration-300 flex items-center p-1"
      >
        <span
          className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            theme === "dark" ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
