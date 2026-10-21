import type { Metadata } from "next";
import Clock from "./Clock";
import HeroLog, { type LogLine } from "./HeroLog";
import Replay from "./Replay";
import Shipped, { type ShippedApp } from "./Shipped";
import VideoCard from "./VideoCard";
import runsFile from "./runs.json";
import type { RunsFile } from "./types";

// Design prototype A, "The Run Log". Not linked from the portfolio, not indexed.
// Every number on this page comes from a recorded run or a source file; see
// the `source` of each run in runs.json and the notes next to each claim.

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Relja Bulajić | Run log (prototype)",
  description:
    "Forward deployed AI engineer for agents that touch real money and real customers. Recorded runs, approval gates, audit trail.",
  robots: { index: false, follow: false },
};

const UPWORK = "https://www.upwork.com/freelancers/~011b06c043368ef973";
const GATEHOUSE = "https://github.com/R3LJA/gatehouse-mcp";
const DEVELOPER = "https://apps.apple.com/us/developer/relja-bulajic/id1801518678";
const UPDATED = "19 Oct 2026";

const { runs } = runsFile as RunsFile;

// ---------- hero log: the intake run's own log lines, real gaps ----------
const intake = runs.find((r) => r.id === "intake")!;
const toSec = (c: string) => {
  const [h, m, s] = c.split(":").map(Number);
  return h * 3600 + m * 60 + s;
};
const heroLines: LogLine[] = intake.result.audit.map((a, i, all) => ({
  clock: a.clock,
  actor: a.actor,
  text: a.text,
  gap: i === 0 ? 600 : (toSec(a.clock) - toSec(all[i - 1].clock)) * 1000,
}));
heroLines.push({
  clock: heroLines[heroLines.length - 1].clock,
  actor: "eval",
  text: "Scored against ground truth: 8 of 8 planted issues caught",
  gap: 900,
});

// ---------- shipped apps: facts from proof-inventory.md, live data from Apple ----------
type AppSeed = Omit<ShippedApp, "icon" | "category" | "firstRelease" | "version" | "versionDate"> & {
  id: string;
  fallback: { category: string; release: string; version: string; versionDate: string };
};

const SEEDS: AppSeed[] = [
  {
    id: "6749489000",
    slug: "airposture",
    name: "AirPosture",
    what: "Posture coach in your AirPods",
    problem:
      "Reads posture from AirPods head motion. A release gate replays 15 scripted scenarios in the simulator and blocks the archive unless every one passes.",
    screenshot: "/apps/airposture/screenshots/01.png",
    url: "https://apps.apple.com/us/app/sit-straight-airposture/id6749489000",
    fallback: { category: "Health & Fitness", release: "2025-10-03", version: "1.7.7", versionDate: "2026-10-18" },
  },
  {
    id: "6766129301",
    slug: "vael",
    name: "Vael",
    what: "AI wardrobe and try-on",
    problem:
      "Virtual try-on with Gemini image models. AI cost is metered per feature on the server, and keys never ship inside the app.",
    screenshot: "/apps/vael/screenshots/01.png",
    url: "https://apps.apple.com/us/app/ai-wardrobe-try-on-vael/id6766129301",
    fallback: { category: "Lifestyle", release: "2026-05-14", version: "1.0.11", versionDate: "2026-09-30" },
  },
  {
    id: "6759579263",
    slug: "recite",
    name: "Recite",
    what: "Voice study app",
    problem:
      "Quizzes you by voice on your own course material, and uses Screen Time shields to lock distracting apps until you study.",
    screenshot: "/apps/recite/screenshots/01.png",
    url: "https://apps.apple.com/us/app/recite-voice-study-ai/id6759579263",
    fallback: { category: "Education", release: "2026-03-15", version: "1.1", versionDate: "2026-03-18" },
  },
  {
    id: "6756668065",
    slug: "gut",
    name: "Gut",
    what: "Relationship red-flag analyzer",
    problem:
      "Reads a chat, pulls out the quotes that matter and learns your profile over time, with AI disclosure built in for App Review.",
    screenshot: "/apps/gut/screenshots/01.png",
    url: "https://apps.apple.com/us/app/gut-relationship-red-flags/id6756668065",
    fallback: { category: "Lifestyle", release: "2026-01-06", version: "1.4", versionDate: "2026-02-13" },
  },
  {
    id: "6759879383",
    slug: "sage",
    name: "Sage",
    what: "AI calorie tracker",
    problem: "Meal scanning and nutrition parsing, repositioned for people on GLP-1 medication.",
    screenshot: "/apps/peptyx/screenshots/01.png",
    url: "https://apps.apple.com/us/app/sage-ai-calorie-tracker/id6759879383",
    fallback: { category: "Health & Fitness", release: "2026-04-01", version: "1.0", versionDate: "2026-04-02" },
  },
];

type Lookup = {
  trackId: number;
  artworkUrl512?: string;
  primaryGenreName?: string;
  releaseDate?: string;
  version?: string;
  currentVersionReleaseDate?: string;
};

const short = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

async function getApps(): Promise<ShippedApp[]> {
  const byId = new Map<string, Lookup>();
  try {
    const res = await fetch(
      `https://itunes.apple.com/lookup?id=${SEEDS.map((s) => s.id).join(",")}&country=us`,
      { next: { revalidate: 86400 } },
    );
    if (res.ok) {
      const data = (await res.json()) as { results?: Lookup[] };
      for (const r of data.results ?? []) byId.set(String(r.trackId), r);
    }
  } catch {
    // Apple's lookup is decoration; the seeds carry the Oct 19 values.
  }
  return SEEDS.map(({ id, fallback, ...s }) => {
    const l = byId.get(id);
    return {
      ...s,
      icon: l?.artworkUrl512 ?? null,
      category: l?.primaryGenreName ?? fallback.category,
      firstRelease: short(l?.releaseDate ?? fallback.release),
      version: l?.version ?? fallback.version,
      versionDate: short(l?.currentVersionReleaseDate ?? fallback.versionDate),
    };
  });
}

function RegMark({ className }: { className: string }) {
  return (
    <svg className={`rl-reg ${className}`} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M12 0v24M0 12h24" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export default async function RunLogPage() {
  const apps = await getApps();

  return (
    <div className="rl-page">
      <header className="rl-top">
        <div className="rl-wrap rl-top-inner">
          <a href="#top" className="rl-top-name">
            Relja Bulajić
          </a>
          <nav className="rl-top-nav rl-mono" aria-label="Sections">
            <a href="#runs">01 Runs</a>
            <a href="#shipped">02 Shipped</a>
            <a href="#next">03 Next step</a>
          </nav>
          <span className="rl-top-meta rl-mono">
            <Clock />
            <span className="rl-top-updated">Updated {UPDATED}</span>
          </span>
        </div>
      </header>

      <main id="top">
        {/* ---------- Hero ---------- */}
        <section className="rl-hero rl-wrap" aria-labelledby="rl-h1">
          <RegMark className="rl-reg--tl" />
          <RegMark className="rl-reg--tr" />
          <div className="rl-hero-main">
            <p className="rl-kicker rl-mono">Forward deployed AI engineer · Belgrade</p>
            <h1 id="rl-h1" className="rl-h1">
              <span className="rl-h1-light">I build AI agents that touch </span>
              <span className="rl-h1-heavy">real money and real customers.</span>
            </h1>
            <p className="rl-lede">
              And the part after the demo that lets you trust them: approval gates, an audit trail, evals and cost
              limits. Nothing moves until a named person signs. I also ship my own iOS apps, alone.
            </p>

            <ol className="rl-notes">
              <li>
                <span className="rl-notes-n rl-mono">1</span>
                <span className="rl-notes-claim">
                  <b>13 of 13</b> red-team attacks blocked by Gatehouse, my open-source MCP server where every write
                  waits for a human. 72 tests.{" "}
                  <a className="rl-link" href={GATEHOUSE} target="_blank" rel="noopener noreferrer">
                    Read the code ↗
                  </a>
                </span>
                <time className="rl-notes-date rl-mono">13 Oct 2026</time>
              </li>
              <li>
                <span className="rl-notes-n rl-mono">2</span>
                <span className="rl-notes-claim">
                  <b>8 of 8</b> planted issues caught by my tax intake agent on a recorded synthetic client, scored
                  against ground truth. One client so far, not a benchmark.
                </span>
                <time className="rl-notes-date rl-mono">8 Oct 2026</time>
              </li>
              <li>
                <span className="rl-notes-n rl-mono">3</span>
                <span className="rl-notes-claim">
                  <b>15 of 15</b> scripted scenarios must pass before AirPosture can be archived for release.
                </span>
                <time className="rl-notes-date rl-mono">17 Oct 2026</time>
              </li>
            </ol>

            <a href="#runs" className="rl-cta">
              Pick a run and watch it <span aria-hidden>↓</span>
            </a>
          </div>

          <aside className="rl-hero-side">
            <HeroLog lines={heroLines} recorded="8 Oct 2026" />
            <VideoCard />
          </aside>
        </section>

        {/* ---------- 01 Runs ---------- */}
        <section id="runs" className="rl-section rl-wrap" aria-labelledby="rl-runs-h">
          <div className="rl-margin rl-mono">
            <span className="rl-margin-n">01</span>
            <span>Runs</span>
            <span className="rl-margin-date">8 to 17 Oct 2026</span>
          </div>
          <div className="rl-section-body">
            <h2 id="rl-runs-h" className="rl-h2">
              Pick an input. Watch the recorded run.
            </h2>
            <p className="rl-section-lede">
              Three real runs from my own systems, played back from recorded traces. Each one stops where a person has
              to approve, and writes every step to a log you can check. Nothing here calls a model, so it costs
              nothing and cannot fail.
            </p>
            <Replay runs={runs} />
          </div>
        </section>

        {/* ---------- 02 Shipped ---------- */}
        <section id="shipped" className="rl-section rl-section--page rl-wrap" aria-labelledby="rl-shipped-h">
          <div className="rl-margin rl-mono">
            <span className="rl-margin-n">02</span>
            <span>Shipped</span>
            <span className="rl-margin-date">Oct 2025 to now</span>
          </div>
          <div className="rl-section-body">
            <h2 id="rl-shipped-h" className="rl-h2">
              Apps I designed, built and shipped alone.
            </h2>
            <p className="rl-section-lede">
              Live on the App Store. Dates and versions come from Apple. Each line is the hardest part of that app.
            </p>
            <Shipped apps={apps} />
            <a className="rl-link rl-dev" href={DEVELOPER} target="_blank" rel="noopener noreferrer">
              All my apps on the App Store ↗
            </a>
          </div>
        </section>

        {/* ---------- 03 Next step ---------- */}
        <section id="next" className="rl-close rl-wrap" aria-labelledby="rl-close-h">
          <div className="rl-margin rl-mono">
            <span className="rl-margin-n">03</span>
            <span>Next step</span>
          </div>
          <div className="rl-section-body">
            <h2 id="rl-close-h" className="rl-close-h">
              You found this through my Upwork proposal. <span>Reply there, and we start with your workflow.</span>
            </h2>
            <div className="rl-close-row">
              <a className="rl-btn rl-btn--ink rl-btn--lg" href={UPWORK} target="_blank" rel="noopener noreferrer">
                My Upwork profile ↗
              </a>
              <p className="rl-close-note">I read every reply myself, from Belgrade (CET).</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="rl-foot rl-wrap rl-mono">
        <span>Relja Bulajić · Belgrade</span>
        <span>Replays are recorded runs. Synthetic clients and demo tenants are marked as such.</span>
        <span>Updated {UPDATED}</span>
      </footer>
    </div>
  );
}
