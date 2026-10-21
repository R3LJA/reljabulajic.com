import type { Metadata } from "next";
import { Suspense } from "react";
import V2 from "./V2";

export const metadata: Metadata = {
  title: "Relja Bulajić | AI Engineer & iOS Developer",
  robots: { index: false, follow: false },
  openGraph: { images: [{ url: "/photos/v2/og.jpg", width: 1200, height: 630 }] },
};

export default function Page() {
  return (
    <Suspense>
      <V2 />
    </Suspense>
  );
}
