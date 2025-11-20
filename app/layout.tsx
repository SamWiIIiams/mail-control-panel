import { ReactNode } from "react";
import "./globals.css";
import Providers from "./Providers";
import TopBarControls from "@/components/TopBarControls";

export const metadata = {
  title: "Jinjnet Resend Dash",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <Providers>
          <TopBarControls />
          {children}
        </Providers>
      </body>
    </html>
  );
}
