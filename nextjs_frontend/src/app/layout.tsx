import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/**
 * RootLayout
 * Provides global styles and typography for the entire app.
 * Auth-gated routes are handled within the (app) group layout.
 */
export const metadata: Metadata = {
  title: "HabitFlow",
  description: "A minimalist daily habit tracker.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning style={{ background: "var(--color-bg)", color: "var(--color-primary)" }}>
        {children}
      </body>
    </html>
  );
}
