import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import FlagshipSystemCard from "@/components/FlagshipSystemCard";
import { flagshipSystems } from "@/lib/aiSystems";

export const metadata: Metadata = {
  title: "Production AI Systems & Agent Engineering · Relja Bulajić",
  description:
    "Inspect production AI systems independently architected and shipped by Relja Bulajić: agent orchestration, prompt engineering, Python backends, evaluations, voice AI and full-stack delivery.",
};

const proof = [
  { value: "57", label: "AI modules in one production platform" },
  { value: "18", label: "specialized agents in one system" },
  { value: "100+", label: "voice intents designed and implemented" },
  { value: "12", label: "products live on the App Store" },
];

const promptEngineering = [
  {
    number: "01",
    title: "Agent roles & boundaries",
    body: "I turn product requirements into precise agent contracts: responsibility, tone, tools, refusal behavior, handoffs and explicit expertise boundaries.",
  },
  {
    number: "02",
    title: "Context engineering",
    body: "I decide what the model sees, when it sees it and how memory, retrieval, user state and tool results are compressed into useful context.",
  },
  {
    number: "03",
    title: "Tool-use prompting",
    body: "Schemas, tool descriptions, confirmation policies and recovery instructions are designed together so agents act predictably, not just speak convincingly.",
  },
  {
    number: "04",
    title: "Eval-driven iteration",
    body: "Prompts are versioned against failure cases, semantic graders, A/B evaluations and rollout gates. Quality is measured as behavior, not writing style.",
  },
  {
    number: "05",
    title: "Guardrails & escalation",
    body: "Confidence, risk and policy thresholds decide when the model may proceed, ask a clarifying question, fall back or route the decision to a human.",
  },
  {
    number: "06",
    title: "Cost-aware model routing",
    body: "Prompt design and provider selection are optimized together, reserving expensive reasoning for tasks where it materially improves the outcome.",
  },
];

const operatingSystem = [
  {
    step: "01",
    title: "Own the architecture",
    body: "I define the data model, trust boundaries, agent contracts, integration surface, failure modes and deployment path before complexity compounds.",
  },
  {
    step: "02",
    title: "Build AI-native",
    body: "Claude Code and Codex are daily engineering tools. Architectural judgment, product decisions, validation and final accountability remain mine.",
  },
  {
    step: "03",
    title: "Gate production quality",
    body: "Type checks, automated tests, agent evaluations, cost and latency controls, security review and observability are part of the system itself.",
  },
  {
    step: "04",
    title: "Ship the whole product",
    body: "I move across frontend, backend, AI, database, mobile, payments, integrations and deployment without handoff gaps.",
  },
];

const stack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Python",
  "FastAPI",
  "Supabase",
  "PostgreSQL",
  "Claude Agent SDK",
  "Anthropic",
  "OpenAI",
  "Gemini",
  "RAG",
  "Embeddings",
  "Vercel",
  "AWS",
  "Firebase",
  "SwiftUI",
  "React Native",
  "Kotlin",
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
              "radial-gradient(70% 90% at 0% 0%, rgba(167,139,250,0.15) 0%, transparent 68%), radial-gradient(60% 80% at 100% 100%, rgba(125,184,232,0.13) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-4xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
            Senior AI systems engineer · Production prompt engineer
          </p>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            I turn AI behavior into{" "}
            <span className="serif-accent gradient-text">
              production software.
            </span>
          </h1>
          <p className="mt-7 max-w-3xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            I independently architect agent systems, prompts, tools, context,
            evaluations, backends and product surfaces. My strongest discipline
            is production prompt engineering: making models behave reliably
            inside real workflows, not optimizing isolated chat responses.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#flagship-systems"
              className="rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-transform duration-300 hover:scale-[1.03]"
            >
              Inspect the systems ↓
            </a>
            <a
              href="https://github.com/R3LJA"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-hairline-strong px-7 py-3 text-sm font-medium text-foreground/90 transition-colors hover:border-accent/50 hover:text-accent"
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

      <section id="flagship-systems" className="mt-28 scroll-mt-24">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
              Flagship systems
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              The scale was already there.{" "}
              <span className="serif-accent text-accent">
                Now it is inspectable.
              </span>
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted">
              These are not tutorial builds or UI concepts. I independently
              designed and implemented the systems below. The repositories
              remain private; each case study exposes the architecture,
              engineering decisions and verifiable scope without exposing
              confidential source code.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 space-y-7">
          {flagshipSystems.map((system, index) => (
            <Reveal key={system.slug} delay={Math.min(index * 0.04, 0.12)}>
              <FlagshipSystemCard system={system} index={index} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-28">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
              Prompt engineering
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Prompts are part of the{" "}
              <span className="serif-accent gradient-text">architecture.</span>
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted">
              Building dozens of agents, voice workflows and AI products taught
              me where prompting actually succeeds or fails: at the boundaries
              between context, tools, policy, evaluation and product behavior.
            </p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {promptEngineering.map((item, index) => (
            <Reveal key={item.number} delay={(index % 3) * 0.05}>
              <article className="h-full rounded-3xl border border-hairline bg-surface p-7">
                <span className="font-mono text-xs text-accent">
                  {item.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
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
                <span className="font-mono text-xs text-accent">
                  {item.step}
                </span>
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
                <span className="serif-accent text-accent">
                  not buzzwords.
                </span>
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
            Need one engineer who can own the{" "}
            <span className="serif-accent gradient-text-fixed">
              entire AI build?
            </span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-zinc-300 sm:text-base">
            I turn ambiguous requirements into architecture and carry the work
            through agent behavior, application code, integrations, testing and
            production deployment.
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
