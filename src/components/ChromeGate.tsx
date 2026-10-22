"use client";

import { usePathname } from "next/navigation";

// Pages with their own design (the v2 home, the unlisted /indie page and the
// /lab design prototypes) render without the portfolio chrome: flow-field background,
// footer and tab bar.
const STANDALONE = ["/indie", "/lab"];

export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/" || STANDALONE.some((p) => pathname === p || pathname?.startsWith(`${p}/`))) {
    return null;
  }
  return <>{children}</>;
}
