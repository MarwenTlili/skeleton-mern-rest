'use client';

import NavBar from "@/components/Navbar";

import "../ui/globals.css";

import { inter } from "@/ui/fonts";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children
}: { children: React.ReactNode }
) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <SessionProvider>
          <NavBar />
          <main className="min-h-screen p-2 border-b-4 border-gray-200 dark:text-white dark:bg-gray-800">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
