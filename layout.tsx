import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CYBER_PUZZLE.AI",
  description: "AI-Powered Hand Gesture Puzzle Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
