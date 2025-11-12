import { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <ThemeProvider>
          {/* Toggle at top-right */}
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
