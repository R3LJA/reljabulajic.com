import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "AI-Native Full-Stack Engineering · Relja Bulajić",
  description:
    "Production AI systems built end to end with Next.js, Supabase, Claude, OpenAI, Vercel, SwiftUI and custom backends.",
};

const proof = [
  { value: "12", label: "products live on the App Store" },
  { value: "4,000+", label: "users across my own products" },
  { value: "100%", label: "Upwork Job Success Score" },
  { value: "5.0", label: "across every client review" },
];

const systems = [
  {
    name: "Vael",
    eyebrow: "Live production ecosystem",
    accent: "#C8B69B",
    summary:
      "A consumer AI fashion platform spanning a native SwiftUI app, a Next.js web app and a Chrome extension, all sharing one Supabase backend and data model.",
    architecture: [
      "33 Supabase Edge Functions",
      "124 database migrations",
      "Multimodal AI image and virtual try-on pipelines",
      "Credits, rate limits, RLS, subscriptions and observability",
    ],
    stack: [
      "SwiftUI",
      "Next.js",
      "Supabase",
      "Gemini",
      "FASHN",
      "RevenueCat",
      "Sentry",
    ],
    links: [
      {
        label: "App Store ↗",
        href: "https://apps.apple.com/us/app/ai-wardrobe-try-on-vael/id6766129301",
      },
      { label: "Web app ↗", href: "https://vael-roan.vercel.app" },
    ],
  },
  {
    name: "DeepLead",
    eyebrow: "Private AI product build",
    accent: "#A78BFA",
    summary:
      "An AI-native sales intelligence system that turns an ICP into researched, scored and operationally safe outreach campaigns through specialized agent workflows.",
    architecture: [
      "42 API routes and 18 agent modules",
      "Claude Agent SDK, OpenAI and policy-based model routing",
      "Cost governor, semantic critic and data triangulation",
      "40 tests plus intelligence, chat and rollout evaluation gates",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "Supabase",
      "Claude Agent SDK",
      "OpenAI",
      "Playwright",
      "Vercel",
    ],
    links: [],
  },
  {
    name: "LaunchPilot",
    eyebrow: "Private agent platform",
    accent: "#7DB8E8",
    summary:
      "A social growth control plane with multi-model content generation, scheduled publishing and authenticated integrations across major social platforms.",
    architecture: [
      "86 API routes and 57 AI modules",
      "Custom agent orchestrator and Anthropic tool loop",
      "Claude, OpenAI, Gemini and Grok routing with fallbacks",
      "21 Supabase migrations and 15 scheduled production jobs",
    ],
    stack: [
      "Next.js 16",
      "Supabase",
      "Anthropic",
      "OpenAI",
      "Stripe",
      "OAuth",
      "Vercel Cron",
    ],
    links: [],
  },
  {
    name: "Trace",
    eyebrow: "Privacy-aware OSINT system",
    accent: "#6EE7B7",
    summary:
      "A mobile-first public-web research system that assembles a legal digital-footprint report without bypassing authentication or accessing private data.",
    architecture: [
      "SwiftUI client with a Python FastAPI backend",
      "Multi-source search, identity resolution and caching pipeline",
      "Authenticated Firebase access and rate limiting",
      "Structured, exportable reports with privacy controls",
    ],
    stack: [
      "SwiftUI",
      "FastAPI",
      "Firebase",
      "Anthropic",
      "SerpAPI",
      "Python",
    ],
    links: [],
  },
  {
    name: "DispatcherPro",
    eyebrow: "Shipped client operations system",
    accent: "#FB7185",
    summary:
      "A real-time dispatch dashboard built for the US trucking market, replacing scattered operational workflows with one driver and load control center.",
    architecture: [
      "Live driver, load and detention tracking",
      "Weather and route risk warnings",
      "PDF invoice generation and document storage",
      "Firebase authentication, realtime data and notifications",
    ],
    stack: ["React", "Firebase", "Maps", "Weather APIs", "PDF", "Vite"],
    links: [],
  },
];

const operatingSystem = [
  {
    step: "01",
    title: "Own the architecture",
    body: "I define the data model, trust boundaries, auth and RLS, agent contracts, integration surface, failure modes and deployment path before complexity compounds.",
  },
  {
    step: "02",
    title: "Build AI-native",
    body: "Claude Code and Codex are part of my daily engineering workflow for exploration, implementation and review. I keep architectural judgment, product decisions and final accountability human-owned.",
  },
  {
    step: "03",
    title: "Gate production quality",
    body: "Type checks, linting, automated tests, agent evaluations, cost and latency controls, security review, observability and deployment checks are part of the system, not an afterthought.",
  },
  {
    step: "04",
    title: "Ship the whole product",
    body: "I move across frontend, backend, AI, database, payments, third-party APIs and deployment without handoff gaps, then stay accountable for what happens after launch.",
  },
];

const stack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Supabase",
  "PostgreSQL",
  "Claude Agent SDK",
  "Anthropic",
  "OpenAI",
  "Python",
  "FastAPI",
  "Vercel",
  "Stripe",
  "OAuth",
  "Firebase",
  "SwiftUI",
];

export default function AiSystemsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-28">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-hairline bg-surface px-7 py-16 sm:px-12 sm:py-20 lg:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 90% at 0% 0%, rgba(167,139,250,0.13) 0%, transparent 68%), radial-gradient(60% 80% at 100% 100%, rgba(125,184,232,0.11) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-4xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
            Senior AI-native full-stack engineer
          </p>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            I architect and ship production AI systems,{" "}
            <span className="serif-accent gradient-text">end to end.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            Next.js, Supabase, Claude agents, custom backends and real client
            integrations. From schema and orchestration to interface,
            deployment and production ownership, I build the complete system.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="https://github.com/R3LJA"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-transform duration-300 hover:scale-[1.03]"
            >
              GitHub profile ↗
            </a>
            <a
              href="https://apps.apple.com/md/developer/relja-bulajic/id1801518678"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-hairline-strong px-7 py-3 text-sm font-medium text-foreground/90 transition-colors hover:border-accent/50 hover:text-accent"
            >
              Live products ↗
            </a>
            <Link
              href="/work"
              className="rounded-full border border-hairline-strong px-7 py-3 text-sm font-medium text-foreground/90 transition-colors hover:border-accent/50 hover:text-accent"
            >
              Full portfolio
            </Link>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline lg:grid-cols-4">
          {proof.map((item) => (
            <div key={item.label} className="bg-surface px-5 py-7 sm:px-7">
              <p className="text-2xl font-semibold tracking-tight text-accent sm:text-3xl">
                {item.value}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {item.label}
              </p>
            </div>
          ))}
        </section>
      </Reveal>

      <section className="mt-28">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
              Selected systems
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Complexity you can{" "}
              <span className="serif-accent text-accent">inspect.</span>
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted">
              These are real systems I designed and built. Client and core
              product repositories remain private; the architecture facts below
              come directly from their codebases, migrations, routes and test
              suites.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 space-y-6">
          {systems.map((system, index) => (
            <Reveal key={system.name} delay={Math.min(index * 0.04, 0.12)}>
              <article className="relative overflow-hidden rounded-[2rem] border border-hairline bg-surface p-7 sm:p-9">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{
                    background: `radial-gradient(55% 100% at 0% 0%, ${system.accent}14 0%, transparent 72%)`,
                  }}
                />
                <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                  <div>
                    <p
                      className="text-[11px] font-medium uppercase tracking-[0.24em]"
                      style={{ color: system.accent }}
                    >
                      {system.eyebrow}
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                      {system.name}
                    </h3>
                    <p className="mt-4 text-pretty text-sm leading-relaxed text-muted sm:text-base">
                      {system.summary}
                    </p>
                    {system.links.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-4">
                        {system.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-foreground/85 transition-colors hover:text-accent"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {system.architecture.map((item) => (
                        <li
                          key={item}
                          className="rounded-2xl border border-hairline bg-foreground/[0.025] px-4 py-3 text-sm leading-relaxed text-foreground/80"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {system.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-foreground/[0.04] px-3 py-1.5 text-[11px] text-muted ring-hairline"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-28">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
            How I operate
          </p>
          <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            AI speed with senior{" "}
            <span className="serif-accent gradient-text">accountability.</span>
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {operatingSystem.map((item, index) => (
            <Reveal key={item.step} delay={(index % 2) * 0.06}>
              <div className="h-full rounded-3xl border border-hairline bg-surface p-7">
                <span className="font-mono text-xs text-accent">{item.step}</span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="mt-28 rounded-[2rem] border border-hairline bg-surface p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
                Working stack
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Production tools,{" "}
                <span className="serif-accent text-accent">not buzzwords.</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-hairline bg-foreground/[0.025] px-3.5 py-2 text-xs text-foreground/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="relative mt-28 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0b0b0d] px-7 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 100% at 50% 110%, rgba(167,139,250,0.18) 0%, transparent 70%)",
            }}
          />
          <h2 className="relative text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Need someone who can own the{" "}
            <span className="serif-accent gradient-text-fixed">whole build?</span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-zinc-300 sm:text-base">
            I can step into an existing delivery machine, turn ambiguous client
            requirements into an architecture, and carry the work through AI,
            application code, integrations and deployment.
          </p>
          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/R3LJA"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-zinc-50 px-8 py-3.5 text-sm font-medium text-zinc-900 transition-transform duration-300 hover:scale-[1.03]"
            >
              Review my GitHub ↗
            </a>
            <Link
              href="/work"
              className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-zinc-100 transition-colors hover:border-white/40"
            >
              Explore all work
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
