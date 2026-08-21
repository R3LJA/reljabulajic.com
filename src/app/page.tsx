import Link from "next/link";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import SignalThread from "@/components/SignalThread";
import StackMarquee from "@/components/StackMarquee";
import Reveal from "@/components/Reveal";
import XcodeShowcase, { type ShowcaseApp } from "@/components/XcodeShowcase";
import { featuredApps } from "@/lib/apps";
import { flagshipSystems } from "@/lib/aiSystems";
import { getScreenshots } from "@/lib/screenshots";

const showcase: Omit<ShowcaseApp, "screenshot">[] = [
  {
    slug: "airposture",
    name: "AirPosture",
    file: "PostureView.swift",
    accent: "#7DB8E8",
    code: [
      "import SwiftUI",
      "import CoreMotion",
      "",
      "struct PostureView: View {",
      "    @State private var pitch: Double = 0",
      "    private let motion = CMHeadphoneMotionManager()",
      "",
      "    var body: some View {",
      "        VStack(spacing: 24) {",
      "            PostureRing(angle: pitch)",
      "            Text(pitch < 12 ? \"Aligned\" : \"Slouching\")",
      "                .font(.title2.weight(.semibold))",
      "            Button(\"Recalibrate\") { recalibrate() }",
      "        }",
      "        .onAppear { startTracking() }  // AirPods sensors",
      "    }",
      "}",
    ],
  },
  {
    slug: "vow",
    name: "Vow",
    file: "NexusView.swift",
    accent: "#A78BFA",
    code: [
      "import SwiftUI",
      "",
      "struct NexusView: View {",
      "    @Environment(HabitStore.self) var store",
      "",
      "    var body: some View {",
      "        ZStack {",
      "            OrbView(energy: store.energy)",
      "                .glow(radius: 48)",
      "            VStack(spacing: 16) {",
      "                StreakBadge(days: store.streak)",
      "                ForEach(store.todaysVows) { vow in",
      "                    VowRow(vow)",
      "                        .swipeToComplete()",
      "                }",
      "            }",
      "        }",
      "    }",
      "}",
    ],
  },
  {
    slug: "vael",
    name: "Vael",
    file: "TodayOutfitView.swift",
    accent: "#C8B69B",
    code: [
      "import SwiftUI",
      "import WeatherKit",
      "",
      "struct TodayOutfitView: View {",
      "    @State private var outfit: Outfit?",
      "",
      "    var body: some View {",
      "        ScrollView {",
      "            OutfitCanvas(outfit)",
      "            HStack(spacing: 12) {",
      "                WeatherPill(temp: weather.temperature)",
      "                CalendarPill(next: day.nextEvent)",
      "            }",
      "            TryOnButton { await tryOn(outfit) }",
      "        }",
      "        .task { outfit = await stylist.daily() }",
      "    }",
      "}",
    ],
  },
];

const proof = [
  { value: "Top Rated", label: "on Upwork" },
  { value: "100%", label: "Job Success" },
  { value: "5.0", label: "every client review" },
  { value: "12", label: "apps live on the App Store" },
  { value: "4,000+", label: "users on my own apps" },
  { value: "B.Eng.", label: "graduated software engineer" },
];

const testimonials = [
  {
    quote:
      "Relja is transparent, honest, and truly proactive. He doesn't just execute tasks, he thinks ahead and brings great ideas to the table.",
    author: "Upwork client, Firebase SwiftUI app",
  },
  {
    quote:
      "The handover was fast, clean, and professional. He communicated clearly and delivered exactly what was promised.",
    author: "Upwork client, iOS app acquisition",
  },
  {
    quote:
      "Relja is a great professional. He communicated well along the way and helped me a lot to resolve the issue I was facing.",
    author: "Upwork client, iOS consulting",
  },
];

const aiCapabilities = [
  {
    title: "Multi-model orchestration",
    body: "Load-balancing across Claude, GPT and Gemini with cost-tiered routing: 4o for depth, 4o-mini for scale.",
    proof: ["LaunchPilot", "Gut"],
  },
  {
    title: "Agent pipelines",
    body: "Background research and reasoning agents running on a custom FastAPI backend, not a single prompt.",
    proof: ["DeepLead", "Trace"],
  },
  {
    title: "Generative & image AI",
    body: "AI image generation and photorealistic virtual try-on: creating new imagery, not just reading it.",
    proof: ["LaunchPilot", "Vael"],
  },
  {
    title: "Vision pipelines",
    body: "Photo-to-structured-data: garment, food and skin analysis, plus on-device Vision OCR.",
    proof: ["Vael", "Skyn", "Sharp"],
  },
  {
    title: "Voice & language",
    body: "On-device transcription, natural-language intent parsing and AI-graded spoken answers.",
    proof: ["Recite", "VoiceVault"],
  },
  {
    title: "On-device & private AI",
    body: "Apple Vision, Speech and Core ML models running on-device, with edge proxies that never store user photos.",
    proof: ["CleanSlate", "Skyn"],
  },
  {
    title: "Grounded, guardrailed reasoning",
    body: "Coaching and scoring grounded in each user's own data, backed by deterministic validation rules.",
    proof: ["Kora", "Lab+"],
  },
  {
    title: "Latency & cost engineering",
    body: "Sub-three-second voice pipelines and cost-tiered model routing: AI budgeted like production infrastructure.",
    proof: ["VoiceFlow", "Gut"],
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24">
      {/* ───────── Hero ───────── */}
      <Hero />

      {/* everything below the hero shares one canvas for the signal thread */}
      <div className="relative">
      <SignalThread />

      {/* ───────── Proof bar ───────── */}
      <Reveal>
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline sm:grid-cols-3 lg:grid-cols-6">
          {proof.map((p) => (
            <div
              key={p.label}
              className="flex flex-col items-center gap-1 bg-surface px-6 py-8"
            >
              <span className="text-2xl font-semibold tracking-tight text-accent">
                {p.value}
              </span>
              <span className="text-xs text-muted">{p.label}</span>
            </div>
          ))}
        </section>
      </Reveal>

      {/* ───────── Flagship AI systems ───────── */}
      <section className="mt-32">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
                Independently architected & built
              </p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
                The systems behind the{" "}
                <span className="serif-accent gradient-text">screens.</span>
              </h2>
              <p className="mt-5 text-pretty leading-relaxed text-muted">
                My strongest work is not visible in an App Store screenshot. It
                lives in agent orchestration, prompt architecture, backend
                services, evaluation gates and production failure handling.
              </p>
            </div>
            <Link
              href="/ai-systems"
              className="shrink-0 text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              Full architecture portfolio →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {flagshipSystems.map((system, index) => (
            <Reveal key={system.slug} delay={(index % 2) * 0.06}>
              <Link
                href={`/ai-systems/${system.slug}`}
                className="group relative flex h-full min-h-72 flex-col overflow-hidden rounded-[2rem] border border-hairline bg-surface p-7 transition-all duration-500 hover:-translate-y-1 hover:border-hairline-strong sm:p-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-80"
                  style={{
                    background: `radial-gradient(75% 70% at 100% 0%, ${system.accent}18 0%, transparent 72%)`,
                  }}
                />
                <div className="relative">
                  <p
                    className="text-[10px] font-medium uppercase tracking-[0.22em]"
                    style={{ color: system.accent }}
                  >
                    {system.category}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                    {system.name}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-foreground/90">
                    {system.headline}
                  </p>
                </div>
                <div className="relative mt-7 grid grid-cols-2 gap-2">
                  {system.metrics.slice(0, 4).map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-hairline bg-foreground/[0.025] px-4 py-3"
                    >
                      <p className="text-lg font-semibold tracking-tight">
                        {metric.value}
                      </p>
                      <p className="mt-0.5 text-[9px] uppercase tracking-wider text-faint">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="relative mt-auto flex items-center justify-between pt-7 text-sm font-medium">
                  <span>Read the case study</span>
                  <span
                    className="text-xl transition-transform duration-300 group-hover:translate-x-1.5"
                    style={{ color: system.accent }}
                  >
                    →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── Featured work ───────── */}
      <section className="mt-32">
        <Reveal>
          <div className="mb-12 flex items-end justify-between">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Shipped <span className="serif-accent text-accent">products</span>
            </h2>
            <Link
              href="/work"
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              All projects →
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredApps.slice(0, 6).map((app, i) => (
            <ProjectCard
              key={app.slug}
              app={app}
              screenshot={getScreenshots(app.slug)[0]}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* ───────── AI Engineering ───────── */}
      <section className="mt-32">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
              AI Engineering
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Production AI,{" "}
              <span className="serif-accent gradient-text">engineered</span>,
              not just prompted.
            </h2>
            <p className="mt-5 text-muted">
              I ship AI as real product infrastructure: multi-model systems,
              agent pipelines, vision, voice and generative image features,
              all grounded in real user data and tuned for reliability,
              latency and cost.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiCapabilities.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-hairline bg-surface p-6 transition-colors hover:border-hairline-strong">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(70% 60% at 20% 0%, rgba(200,182,155,0.10) 0%, transparent 70%)",
                  }}
                />
                <h3 className="relative font-semibold tracking-tight">
                  {c.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted">
                  {c.body}
                </p>
                <div className="relative mt-4 flex flex-wrap gap-1.5">
                  {c.proof.map((p) => (
                    <span
                      key={p}
                      className="rounded-full px-2.5 py-1 text-[11px] font-medium text-accent"
                      style={{
                        background: "rgba(200,182,155,0.08)",
                        boxShadow: "inset 0 0 0 1px var(--hairline)",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── Stack marquee ───────── */}
      <StackMarquee />

      {/* ───────── Full-stack + security ───────── */}
      <section className="mt-32 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <div className="relative h-full overflow-hidden rounded-[2rem] border border-hairline bg-surface p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 60% at 0% 0%, rgba(200,182,155,0.10) 0%, transparent 70%)",
              }}
            />
            <p className="relative text-xs font-medium uppercase tracking-[0.28em] text-muted">
              Full-stack, for real
            </p>
            <h2 className="relative mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              A graduated software{" "}
              <span className="serif-accent gradient-text">engineer</span> who
              owns the whole system.
            </h2>
            <p className="relative mt-5 max-w-xl text-sm leading-relaxed text-muted">
              I hold an engineering degree in software and run my own portfolio
              of startups, and it shows in how I build: the native SwiftUI iOS
              app, the Python or Firebase backend behind it, the database schema,
              the payment rails and the deployment pipeline, all designed by
              one person who understands every layer and has skin in the game.
              No hand-offs, no gaps where bugs hide.
            </p>
            <div className="relative mt-7 flex flex-wrap gap-1.5">
              {[
                "Full-stack iOS · SwiftUI",
                "FastAPI · Python backends",
                "PostgreSQL · Firestore",
                "Plaid · Stripe · StoreKit 2",
                "Health-tech · HealthKit",
                "Next.js web platforms",
                "CI & deployment",
              ].map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-foreground/[0.04] px-3 py-1.5 text-[11px] text-muted ring-hairline"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="relative h-full overflow-hidden rounded-[2rem] border border-hairline bg-surface p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 60% at 100% 0%, rgba(110,231,183,0.08) 0%, transparent 70%)",
              }}
            />
            <div className="relative flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-300">
                <svg viewBox="0 0 24 24" fill="none" className="size-5">
                  <path
                    d="M12 3 4.5 6v5.2c0 4.6 3.2 8.2 7.5 9.8 4.3-1.6 7.5-5.2 7.5-9.8V6L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m9 11.8 2.2 2.2L15.4 9.7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
                Security-first
              </p>
            </div>
            <h2 className="relative mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Zero security incidents.{" "}
              <span className="serif-accent text-accent">Ever.</span>
            </h2>
            <p className="relative mt-5 text-sm leading-relaxed text-muted">
              Every app I ship is hardened before launch: audited auth flows,
              strict Firestore and row-level security rules, App Check,
              encrypted storage via CryptoKit and Keychain, and secrets that
              never touch git. Backed by hands-on DevOps and server
              administration, so the infrastructure is as solid as the code.
            </p>
            <ul className="relative mt-6 space-y-2.5">
              {[
                "Security audits on every release",
                "Hardened auth, rules & App Check",
                "Secrets hygiene & encrypted storage",
                "DevOps, deployment & monitoring",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-foreground/80"
                >
                  <span className="size-1.5 rounded-full bg-emerald-400/80" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* ───────── Xcode showcase ───────── */}
      <XcodeShowcase
        items={showcase.map((s) => ({
          ...s,
          screenshot: getScreenshots(s.slug)[0],
        }))}
      />

      {/* ───────── Testimonials ───────── */}
      <section className="mt-32">
        <Reveal>
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            What clients <span className="serif-accent text-accent">say</span>
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.08}>
              <figure className="flex h-full flex-col justify-between rounded-3xl border border-hairline bg-surface p-7">
                <blockquote className="text-pretty text-[15px] leading-relaxed text-foreground/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-2 text-xs text-faint">
                  <span className="text-accent">★★★★★</span>
                  {t.author}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── CTA: always-dark "midnight" card with founder loop ───────── */}
      <Reveal>
        <section className="group relative mt-32 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0b0b0d] px-8 py-20 text-center">
          {/* ambient founder loop, leans in slightly on hover */}
          <video
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55 transition-opacity duration-700 group-hover:opacity-80 motion-reduce:hidden"
            style={{ objectPosition: "50% 42%" }}
            src="/videos/founder-loop.mp4"
            poster="/videos/founder-loop.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          {/* readability scrim pooling behind the copy */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(58% 75% at 50% 46%, rgba(7,7,8,0.78) 0%, rgba(7,7,8,0.42) 58%, rgba(7,7,8,0.12) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 110%, rgba(200,182,155,0.13) 0%, transparent 70%)",
            }}
          />
          <h2 className="relative text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Built to{" "}
            <span className="serif-accent gradient-text-fixed">ship</span>.
          </h2>
          <p className="relative mx-auto mt-5 max-w-md text-zinc-300/90">
            When I&apos;m not building for clients, I&apos;m building my own startups.
            Every project gets that same founder energy: design, code, App
            Store, owned end to end.
          </p>
          <div className="relative mt-9">
            <Link
              href="/work"
              className="inline-block rounded-full bg-zinc-50 px-8 py-3.5 text-sm font-medium text-zinc-900 transition-transform duration-300 hover:scale-[1.03]"
            >
              Explore the work
            </Link>
          </div>
        </section>
      </Reveal>
      </div>
    </main>
  );
}
