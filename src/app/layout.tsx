import type { Metadata, Viewport } from "next";
import { Cinzel, Cinzel_Decorative, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const cinzelDeco = Cinzel_Decorative({
  variable: "--font-cinzel-deco",
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nightfall: Haunted Night 2026 | The Ultimate Halloween Experience",
  description:
    "The city's ultimate Halloween experience. 31 October 2026 at The Grand Arena, Lahore — haunted maze, live DJs, costume contest with cash prizes, food & drinks. Turn your nightmares into memories.",
  keywords: [
    "Nightfall",
    "Haunted Night 2026",
    "Halloween event",
    "Lahore",
    "haunted house",
    "costume party",
  ],
  openGraph: {
    title: "Nightfall: Haunted Night 2026",
    description: "Turn your nightmares into memories. 31 October 2026 — The Grand Arena, Lahore.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07060a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cinzel.variable} ${cinzelDeco.variable} font-inter antialiased bg-night-950 text-gray-200`}
      >
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
