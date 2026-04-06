import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pomodoro Tracker — Focus Timer & Productivity Tool",
  description: "A beautiful Pomodoro Timer to help you stay focused and productive. Track work sessions, manage breaks, and build better work habits with the Pomodoro Technique.",
  keywords: ["pomodoro", "timer", "productivity", "focus", "work timer", "break timer", "pomodoro technique"],
  authors: [{ name: "Pomodoro Tracker" }],
  openGraph: {
    title: "Pomodoro Tracker",
    description: "Stay focused and productive with the Pomodoro Technique",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
