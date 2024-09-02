import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "flashcard/it",
  description: "Elevate your study sessions with flashcard/it, the innovative flashcard maker app designed to simplify and enhance your learning experience. Whether you’re preparing for exams, mastering new concepts, or organizing information, flashcard/it offers a flexible and intuitive platform to create, manage, and review flashcards with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
