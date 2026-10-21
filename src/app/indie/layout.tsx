import { Bricolage_Grotesque } from "next/font/google";
import "./indie.css";

// /indie is designed on its own (see indie.css); ChromeGate keeps the
// portfolio's background, footer and tab bar off this route.

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

export default function IndieLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="indie-root" data-theme="light" suppressHydrationWarning className={bricolage.variable}>
      {children}
    </div>
  );
}
