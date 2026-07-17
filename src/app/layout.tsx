import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import FlowField from "@/components/FlowField";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import TabBar from "@/components/TabBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reljabulajic.com"),
  title: "Relja Bulajić · Full-Stack & AI Engineer",
  description:
    "Full-stack & AI engineer. I design and ship AI-native products end to end, from pixel-perfect SwiftUI to custom Python backends and LLM systems. Top Rated on Upwork, 100% Job Success, 12 apps live on the App Store with 4,000+ users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain">
        <SmoothScroll />
        <FlowField />
        <div className="flex-1">{children}</div>
        <Footer />
        <TabBar />
      </body>
    </html>
  );
}
