import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import WorkGrid from "@/components/WorkGrid";
import { apps } from "@/lib/apps";
import { getScreenshots } from "@/lib/screenshots";

export const metadata: Metadata = {
  title: "Work · Relja Bulajić",
  description:
    "iOS and web apps: fintech, AI, health and productivity. Designed, built and shipped end to end.",
};

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-28">
      <Reveal>
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-muted">
          Portfolio
        </p>
        <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Every app here was{" "}
          <span className="serif-accent gradient-text">shipped</span>, not just
          started.
        </h1>
        <p className="mt-6 max-w-xl text-muted">
          My own startups and client work, side by side: native iOS apps and
          full-stack web platforms, each one designed, engineered, launched and
          monetized end to end.
        </p>
      </Reveal>
      <div className="mt-16">
        <WorkGrid
          items={apps.map((app) => ({
            app,
            screenshot: getScreenshots(app.slug)[0],
          }))}
        />
      </div>
    </main>
  );
}
