import type { Metadata } from "next";
import { Suspense } from "react";
import V2 from "./lab/v2/V2";
import { V2Root } from "./lab/v2/layout";

// The v2 portfolio is the home page. The previous home is kept in git as the
// tag portfolio-v1.
export const metadata: Metadata = {
  title: "Relja Bulajić | AI Engineer & iOS Developer",
  openGraph: { images: [{ url: "/photos/v2/og.jpg", width: 1200, height: 630 }] },
};

export default function Home() {
  return (
    <V2Root>
      <Suspense>
        <V2 />
      </Suspense>
    </V2Root>
  );
}
