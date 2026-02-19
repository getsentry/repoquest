import type { Metadata } from "next";
import { Press_Start_2P, Inter } from "next/font/google";
import { Header } from "@/components/header";
import { MouseSparkles } from "@/components/mouse-sparkles";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "RepoQuest | Sentry RPG Tracker",
  description:
    "Track AI readiness across Sentry's open source repos — RPG style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart.className} ${pressStart.variable} ${inter.variable}`}>
        <MouseSparkles />
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
