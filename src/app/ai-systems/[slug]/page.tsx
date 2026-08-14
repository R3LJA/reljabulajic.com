import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import SystemScene from "@/components/SystemScene";
import { flagshipSystems, getAiSystem } from "@/lib/aiSystems";

export function generateStaticParams() {
  return flagshipSystems.map((system) => ({ slug: system.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const system = getAiSystem(slug);
  if (!system) return {};

  return {
    title: `${system.name} AI System Architecture · Relja Bulajić`,
    description: `${system.headline} A production system independently architected and implemented by Relja Bulajić.`,
  };
}

export default async function AiSystemCaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const system = getAiSystem(slug);
  if (!system) notFound();

  const currentIndex = flagshipSystems.findIndex(
    (item) => item.slug === system.slug,
  );
  const nextSystem = flagshipSystems[(currentIndex + 1) % flagshipSystems.length];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-28">
      <Reveal>
        <Link
          href="/ai-systems#flagship-systems"
          className="text-sm text-muted transition-colors hover:text-accent"
        >
          ← All AI systems
        </Link>
      </Reveal>

      <section className="mt-8 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
        <Reveal>
          <div>
            <p
              className="text-xs font-medium uppercase tracking-[0.28em]"
              style={{ color: system.accent }}
            >
              {system.category}
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">
              {system.name}
            </h1>
            <p className="mt-5 max-w-3xl text-balance text-2xl font-medium leading-tight text-foreground/90 sm:text-4xl">
              {system.headline}
            </p>
            <p className="mt-7 max-w-2xl text-pretty leading-relaxed text-muted">
              {system.summary}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <aside
            className="rounded-3xl border p-6 sm:p-7"
            style={{
              borderColor: `${system.accent}35`,
              background: `${system.accent}0c`,
            }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: system.accent }}
            >
              My ownership
            </p>
            <p className="mt-4 text-sm font-medium leading-relaxed text-foreground/90 sm:text-base">
              {system.ownership}
            </p>
          </aside>
        </Reveal>
      </section>

      <Reveal delay={0.1}>
        <section
          className="relative mt-16 min-h-[360px] overflow-hidden rounded-[2.5rem] border border-hairline bg-[#0b0d0f] sm:min-h-[480px]"
        >
          <SystemScene slug={system.slug} accent={system.accent} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-6 pb-6 pt-24 sm:px-9 sm:pb-8">
            <p className="max-w-3xl text-xs leading-relaxed text-zinc-400">
              {system.evidence}
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline lg:grid-cols-4">
          {system.metrics.map((metric) => (
            <div key={metric.label} className="bg-surface px-5 py-7 sm:px-7">
              <p
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
                style={{ color: system.accent }}
              >
                {metric.value}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {metric.label}
              </p>
            </div>
          ))}
        </section>
      </Reveal>

      <section className="mt-28">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
            System anatomy
          </p>
          <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Complexity broken into{" "}
            <span className="serif-accent text-accent">
              reliable boundaries.
            </span>
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {system.architecture.map((item, index) => (
            <Reveal key={item.title} delay={(index % 2) * 0.06}>
              <article className="h-full rounded-3xl border border-hairline bg-surface p-7 sm:p-8">
                <span
                  className="font-mono text-xs"
                  style={{ color: system.accent }}
                >
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">
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

      <section className="mt-28 grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
        <Reveal>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
              Engineering judgment
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              The decisions behind the build.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Seniority is not the number of technologies in a project. It is
              the ability to identify failure modes early and choose boundaries
              that keep the system understandable after launch.
            </p>
          </div>
        </Reveal>
        <div className="space-y-4">
          {system.decisions.map((decision, index) => (
            <Reveal key={decision.title} delay={index * 0.05}>
              <article className="rounded-3xl border border-hairline bg-surface p-7">
                <h3 className="text-lg font-semibold tracking-tight">
                  {decision.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {decision.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="mt-28 rounded-[2rem] border border-hairline bg-surface p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
                Production stack
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Chosen for the system.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {system.stack.map((item) => (
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
        <Link
          href={`/ai-systems/${nextSystem.slug}`}
          className="group mt-24 flex items-center justify-between rounded-3xl border border-hairline bg-surface px-7 py-9 transition-colors hover:border-hairline-strong sm:px-9"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-faint">
              Next system
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {nextSystem.name}
            </p>
          </div>
          <span
            className="text-3xl transition-transform duration-300 group-hover:translate-x-1.5"
            style={{ color: nextSystem.accent }}
          >
            →
          </span>
        </Link>
      </Reveal>
    </main>
  );
}
