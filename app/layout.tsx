import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "../contexts/ThemeProvider";
import NavBar from "@/components/NavBar";
import { SessionProvider } from "next-auth/react";
import React from "react";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cartomania",
  description: "Play and learn geography with Cartomania !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark">
          <SessionProvider>
            <div className="flex justify-center w-full">
              <div className="flex flex-col items-center w-full max-w-6xl gap-8 min-h-screen">
                <NavBar />
                {children}
                <Footer />
              </div>
            </div>
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
