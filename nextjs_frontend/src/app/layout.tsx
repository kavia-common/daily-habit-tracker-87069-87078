import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

/**
 * RootLayout
 * Provides global styles and typography for the entire app.
 * Wraps the app with ClerkProvider for authentication context.
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
      <body
        className={inter.className}
        suppressHydrationWarning
        style={{ background: "var(--color-bg)", color: "var(--color-primary)" }}
      >
        <ClerkProvider
          dynamic
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
          appearance={{
            variables: { colorPrimary: "#111827", colorText: "#111827" },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
