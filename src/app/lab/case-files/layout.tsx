import { Archivo, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import "./case-files.css";

// /lab/case-files: design prototype B, "Case Files". An editorial issue with
// a cover, an index, one full case-file spread, an app shelf and a close.
// ChromeGate keeps the portfolio background, footer and tab bar off /lab.
// All styles live in case-files.css under #cf-root.

const display = Archivo({
  variable: "--cf-display",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
});

const text = Source_Serif_4({
  variable: "--cf-text",
  subsets: ["latin", "latin-ext"],
});

const mono = IBM_Plex_Mono({
  variable: "--cf-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function CaseFilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="cf-root"
      className={`${display.variable} ${text.variable} ${mono.variable}`}
    >
      {children}
    </div>
  );
}
