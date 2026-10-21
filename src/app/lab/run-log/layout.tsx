import { Host_Grotesk, JetBrains_Mono } from "next/font/google";
import "./run-log.css";

// /lab/run-log: design prototype "The Run Log". Its own fonts and a scoped
// stylesheet; ChromeGate keeps the portfolio chrome off /lab.

const grotesk = Host_Grotesk({
  variable: "--rl-font-sans",
  subsets: ["latin", "latin-ext"],
});

const mono = JetBrains_Mono({
  variable: "--rl-font-mono",
  subsets: ["latin", "latin-ext"],
});

export default function RunLogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="rl-root" className={`${grotesk.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
