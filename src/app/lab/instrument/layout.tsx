import { Archivo, Martian_Mono } from "next/font/google";
import "./instrument.css";

// Prototype C, "The Instrument". Its own design, scoped under #instrument-root.
// ChromeGate keeps the portfolio's background, footer and tab bar off /lab.

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
});

const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
});

export default function InstrumentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="instrument-root" className={`${archivo.variable} ${martian.variable}`}>
      {children}
    </div>
  );
}
