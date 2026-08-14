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
  title: "Relja Bulajić · Senior AI Systems & Prompt Engineer",
  description:
    "Senior AI systems and production prompt engineer. I independently architect and ship multi-agent platforms, custom Python backends, evaluations, voice AI and complete AI-native products.",
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
