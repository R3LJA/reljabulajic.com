import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { stackCategories } from "@/lib/stack";

export const metadata: Metadata = {
  title: "About · Relja Bulajić",
  description:
    "Founder, full-stack & AI engineer from Belgrade. Top Rated on Upwork, 12 apps live on the App Store with 4,000+ users.",
};

const story: {
  badge: string;
  color: string;
  icon: React.ReactNode;
  text: string;
}[] = [
  {
    badge: "The beginning",
    color: "#C8B69B",
    icon: (
      // spark
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="M12 3.5c.7 4.4 3.4 7.1 8 8-4.6.9-7.3 3.6-8 8-.7-4.4-3.4-7.1-8-8 4.6-.9 7.3-3.6 8-8Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    text: "I'm Relja, a graduated software engineer, full-stack & AI developer from Belgrade, Serbia. While most kids were playing video games, I was learning how to build them. At 16 I was already writing Swift alongside senior developers from major tech companies, taking on real-world tasks just to sharpen my skills, because for me coding was never just work.",
  },
  {
    badge: "The leap",
    color: "#818CF8",
    icon: (
      // graduation cap + arrow
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 10.8V15c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    text: "From there I went on to study software engineering at university, where the coursework came easily because I was already building the real thing every day. So instead of waiting for a diploma to start, I launched both careers in parallel: a freelance practice serving clients around the world, and my own solopreneur path shipping products under my name. Both are still going strong today, and feed each other constantly.",
  },
  {
    badge: "The founder",
    color: "#F4845F",
    icon: (
      // rocket
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="M14.5 4.5c2.6-1 5-1 5-1s0 2.4-1 5c-1.3 3.4-4.2 6.6-7 8l-3-3c1.4-2.8 4.6-7.7 6-9Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 13.5c-1.5.2-3 1.5-3.5 5.5 4-.5 5.3-2 5.5-3.5M15 9.5a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    text: "But I'm not just a developer for hire, I'm a founder. I have 12 apps live on the App Store, used by more than 4,000 people, AirPosture alone has over 2,000 users and spans iPhone, Apple Watch and macOS: AI-powered wellness and style apps, voice-first study tools, fintech with real bank connections, products with paying subscribers that I design, build, launch and market myself. Every startup of mine is a lab where I learn what actually makes apps succeed: positioning, App Store optimization, paywalls that convert, retention that lasts. And that founder experience is exactly what my clients get: I think about your users, your conversion and your launch the way I think about my own.",
  },
  {
    badge: "The craft",
    color: "#7DB8E8",
    icon: (
      // layers
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="m12 3.5 8.5 4.5L12 12.5 3.5 8 12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="m4.5 12 7.5 4 7.5-4M4.5 16l7.5 4 7.5-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    text: "I work the way small, excellent teams work, except the team is one person. SwiftUI and modern Swift on the front, Firebase, Supabase or custom Python backends behind it, RevenueCat and StoreKit 2 for monetization, a design sensibility shaped by Apple's own products, and a modern AI-accelerated toolchain that lets one person ship at team speed.",
  },
  {
    badge: "Health & life sciences",
    color: "#6EE7B7",
    icon: (
      // heart pulse
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="M12 20s-7.5-4.8-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.2-7.5 10-7.5 10Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M7 12h2.5l1.5-2.5 2 4 1.5-1.5H17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    text: "A big part of my work lives in health-tech and life sciences: posture tracking on real motion sensors, GLP-1 nutrition, AI skin analysis, HealthKit-driven energy coaching, and Lab+, an experimental-design validation platform for researchers. It's a domain where my security-first engineering and respect for sensitive user data matter as much as the code.",
  },
  {
    badge: "The trust",
    color: "#A78BFA",
    icon: (
      // star
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="m12 3.8 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.5l5.4-.8L12 3.8Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    text: "On Upwork I'm Top Rated with a 100% Job Success score, and every client review I've ever received is five stars. I take on a small number of projects at a time and treat each one like my own product.",
  },
  {
    badge: "Off the clock",
    color: "#FB7185",
    icon: (
      // guitar / music note
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="M9.5 17.5a2.8 2.8 0 1 1-5.6 0 2.8 2.8 0 0 1 5.6 0Zm0 0V5.8l10-2.3v11.3m0 0a2.8 2.8 0 1 1-5.6 0 2.8 2.8 0 0 1 5.6 0ZM9.5 9.3l10-2.3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    text: "Away from the keyboard you'll find me playing guitar, in the gym, or on a tennis court. And in true Serbian tradition, I craft homemade rakija passed down through generations of my family, like shipping good software, it's all about precision, patience and caring how the result feels when you share it.",
  },
];

const principles = [
  {
    title: "Ownership, end to end",
    body: "I don't hand off problems. Design, architecture, code, App Store review, one person accountable for the whole journey, from first sketch to published app.",
  },
  {
    title: "Apple-grade polish",
    body: "Pixel-perfect SwiftUI, native motion, attention to the details users feel but never name. If it wouldn't pass for a first-party app, it isn't done.",
  },
  {
    title: "Speed without debt",
    body: "Fast iterations on clean MVVM architecture, most apps go from idea to TestFlight in weeks, built on foundations that survive version 2, 3 and 10.",
  },
  {
    title: "Founder mindset",
    body: "I build and launch my own startups, so I treat your product like one of mine: questioning scope, protecting the user experience, and caring about what happens after launch, not just the handover.",
  },
  {
    title: "Trust by default",
    body: "Clear communication, realistic milestones, honest trade-offs. My clients' reviews say it better than I can, every single one is 5.0.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-28">
      <div className="grid items-start gap-14 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Reveal>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-muted">
              About
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl">
              Engineer by training.{" "}
              <span className="serif-accent gradient-text">
                Product builder
              </span>{" "}
              by obsession.
            </h1>
          </Reveal>
          <div className="mt-10">
            {story.map((ch, i) => (
              <Reveal key={ch.badge} delay={0.05}>
                <div className="group relative flex gap-5 sm:gap-7">
                  {/* rail: node + connector */}
                  <div className="flex flex-col items-center">
                    <span
                      className="z-10 flex size-11 shrink-0 items-center justify-center rounded-full border bg-surface transition-shadow duration-500 group-hover:shadow-[0_0_24px_-4px_var(--tw-shadow-color)]"
                      style={{
                        borderColor: `${ch.color}40`,
                        color: ch.color,
                        ["--tw-shadow-color" as string]: `${ch.color}66`,
                      }}
                    >
                      {ch.icon}
                    </span>
                    {i < story.length - 1 && (
                      <span
                        aria-hidden
                        className="w-px flex-1"
                        style={{
                          background: `linear-gradient(to bottom, ${ch.color}50, ${story[i + 1].color}50)`,
                        }}
                      />
                    )}
                  </div>
                  {/* content */}
                  <div className={i < story.length - 1 ? "pb-10" : ""}>
                    <span
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em]"
                      style={{
                        borderColor: `${ch.color}35`,
                        color: ch.color,
                        background: `${ch.color}0d`,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")} · {ch.badge}
                    </span>
                    <p className="mt-3 text-pretty leading-relaxed text-foreground/80">
                      {ch.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="space-y-6 lg:sticky lg:top-10">
          <Reveal delay={0.15}>
            <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-hairline">
              <Image
                src="/photos/relja-portrait.jpeg"
                alt="Relja Bulajić"
                width={800}
                height={1066}
                priority
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-14">
                <p className="text-sm font-medium text-white">Relja Bulajić</p>
                <p className="text-xs text-white/70">Belgrade, Serbia</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-hairline">
              <Image
                src="/photos/relja-wallst.png"
                alt="Relja Bulajić in New York"
                width={800}
                height={1200}
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5 pt-14">
                <p className="flex items-center gap-2 text-sm font-medium text-white">
                  Belgrade <span className="text-white/50">↔</span> New York
                </p>
                <p className="mt-0.5 text-xs text-white/70">
                  Most of my clients are US-based; I work on their time zone
                  when it matters.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* roots & recognition */}
      <section className="mt-28">
        <Reveal>
          <h2 className="mb-3 text-3xl font-semibold tracking-tight">
            Where it <span className="serif-accent text-accent">started</span>
          </h2>
          <p className="mb-10 max-w-lg text-sm text-muted">
            Long before the App Store, I was building, inventing and competing.
            The instinct came first; the craft caught up later.
          </p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* feature: first invention */}
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-hairline bg-surface p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(75% 60% at 0% 0%, rgba(45,212,191,0.10) 0%, transparent 70%)",
                }}
              />
              <div className="relative flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl border border-hairline bg-foreground/[0.03] text-[#2DD4BF]">
                  {/* chip / circuit icon */}
                  <svg viewBox="0 0 24 24" fill="none" className="size-5">
                    <rect
                      x="7"
                      y="7"
                      width="10"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#2DD4BF]">
                  My first invention
                </span>
              </div>
              <h3 className="relative mt-5 text-xl font-semibold tracking-tight">
                An award-winning Arduino sensor, at 17.
              </h3>
              <p className="relative mt-4 text-sm leading-relaxed text-muted">
                In high school I designed an Arduino-based sensor system to
                repel moles from rural farmland using ground vibration, and won
                an award for the idea at a national Arduino competition. It was
                my first real invention: a complete hardware concept, not a
                class assignment. I couldn&apos;t take it to production at the time
                because the sensor hardware was beyond what a teenager could
                fund, but the lesson stuck. Turning a real-world problem into a
                working system is still exactly what I do, just in software now.
              </p>
            </div>
          </Reveal>

          {/* recognition cards */}
          <div className="grid gap-6">
            {[
              {
                badge: "Student of the Generation",
                text: "Graduated top of my high-school generation, the single highest distinction the school awards.",
                color: "#C8B69B",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="size-5">
                    <path
                      d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.5 10.5V15c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.5M21.5 8.5v5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                badge: "1st place · Python",
                text: "Won a local programming competition in Python during high school, my first taste of building under pressure.",
                color: "#7DB8E8",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="size-5">
                    <path
                      d="M8 4h8v3a4 4 0 0 1-8 0V4Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 5H5v1.5A2.5 2.5 0 0 0 7.5 9M16 5h3v1.5A2.5 2.5 0 0 1 16.5 9M12 11v4m-2.5 4.5h5L14 16h-4l-.5 3.5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                badge: "Arduino · certified",
                text: "Completed a formal Arduino course and certification, where the hardware-meets-software bug first bit.",
                color: "#34D399",
                icon: (
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
                ),
              },
            ].map((a, i) => (
              <Reveal key={a.badge} delay={i * 0.07}>
                <div className="flex h-full items-start gap-4 rounded-3xl border border-hairline bg-surface p-6">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-hairline bg-foreground/[0.03]"
                    style={{ color: a.color }}
                  >
                    {a.icon}
                  </span>
                  <div>
                    <p
                      className="text-[10px] font-medium uppercase tracking-[0.18em]"
                      style={{ color: a.color }}
                    >
                      {a.badge}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {a.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* principles */}
      <section className="mt-28">
        <Reveal>
          <h2 className="mb-10 text-3xl font-semibold tracking-tight">
            How I <span className="serif-accent text-accent">work</span>
          </h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.08}>
              <div className="h-full rounded-3xl border border-hairline bg-surface p-7">
                <h3 className="font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* stack */}
      <section id="stack" className="mt-28 scroll-mt-24">
        <Reveal>
          <h2 className="mb-3 text-3xl font-semibold tracking-tight">
            The <span className="serif-accent text-accent">stack</span>, in
            detail
          </h2>
          <p className="mb-10 max-w-lg text-sm text-muted">
            Grounded in shipped products, not tutorials, every framework below
            is running in production right now.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {stackCategories.map((s, i) => (
            <Reveal key={s.name} delay={(i % 2) * 0.06}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-hairline bg-surface p-6 transition-colors hover:border-hairline-strong">
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(70% 60% at 20% 0%, ${s.color}12 0%, transparent 70%)`,
                  }}
                />
                <div className="relative flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-hairline bg-foreground/[0.03]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.logo}
                      alt=""
                      aria-hidden
                      className="size-5 opacity-90"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold tracking-tight">{s.name}</h3>
                    <span
                      className="text-[10px] font-medium uppercase tracking-[0.18em]"
                      style={{ color: `${s.color}cc` }}
                    >
                      {s.area}
                    </span>
                  </div>
                </div>
                <p className="relative mt-3.5 text-sm leading-relaxed text-muted">
                  {s.body}
                </p>
                <div className="relative mt-4 flex flex-wrap gap-1.5">
                  {s.chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-foreground/[0.04] px-2.5 py-1 text-[11px] text-faint ring-hairline"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <div className="mt-24 text-center">
          <Link
            href="/work"
            className="inline-block rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background transition-transform duration-300 hover:scale-[1.03]"
          >
            See the work
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
