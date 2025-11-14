import { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

// Import a small client-only component
import TopBarControls from "@/components/TopBarControls";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <ThemeProvider>
          {/* Top-right controls */}
          <TopBarControls />

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
