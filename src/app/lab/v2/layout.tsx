import { Inter_Tight } from "next/font/google";
import "./v2.css";

// Prototype of the next portfolio: the current site's content, rebuilt as a
// light, type-led page that turns to night on scroll. Unlisted (/lab is
// outside the portfolio chrome and never linked).

const interTight = Inter_Tight({
  variable: "--font-v2",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
});

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div id="v2-root" className={interTight.variable}>
      {children}
    </div>
  );
}
