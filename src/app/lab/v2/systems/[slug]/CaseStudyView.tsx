"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import BastionDemo from "../demos/BastionDemo";
import DeepLeadDemo from "../demos/DeepLeadDemo";
import DispatchDemo from "../demos/DispatchDemo";
import LaunchPilotDemo from "../demos/LaunchPilotDemo";
import PayControlDemo from "../demos/PayControlDemo";
import AtelierDemo from "../demos/AtelierDemo";
import SupportAgentDemo from "../demos/SupportAgentDemo";
import VoiceVaultDemo from "../demos/VoiceVaultDemo";
import { EASE, MaskLine } from "../../Hero";
import { spotHandlers } from "../../Practices";
import { Statement } from "../../Sections";
import type { CaseStudy } from "../cases";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const pad = (n: number) => String(n).padStart(2, "0");

/* ── Opening: the system's film, full screen ──────────────────────────── */

function Opening({ c, index, total }: { c: CaseStudy; index: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // computed in JS so framer-motion keeps them off the browser's ScrollTimeline
  const scale = useTransform(scrollYProgress, (v) => (reduced ? 1 : 1 + v * 0.18));
  const veil = useTransform(scrollYProgress, (v) => 0.25 + clamp01(v * 1.4) * 0.6);
  const textY = useTransform(scrollYProgress, (v) => (reduced ? 0 : v * -120));

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden bg-[var(--night)] text-[var(--night-ink)]">
      <motion.video
        src={`/videos/v2/systems/${c.film}.mp4`}
        poster={`/videos/v2/systems/${c.film}.jpg`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ scale }}
        className="v2-will absolute inset-0 h-full w-full object-cover"
      />
      <motion.div style={{ opacity: veil }} className="absolute inset-0 bg-[var(--night)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--night)] via-[var(--night)]/35 to-[var(--night)]/40" />
      <motion.div style={{ y: textY }} className="absolute inset-x-0 bottom-0 px-[5vw] pb-[12vh] md:px-[9vw]">
        <motion.p
          className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold)]"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        >
          Case {pad(index + 1)} / {pad(total)} · {c.category}
        </motion.p>
        <h1 className="v2-display mt-5 text-[19vw] md:text-[12vw]">
          <MaskLine delay={0.15}>{c.name}</MaskLine>
        </h1>
        <motion.p
          className="mt-6 max-w-2xl text-xl leading-snug tracking-[-0.02em] text-[var(--night-ink)]/85 md:text-3xl"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
        >
          {c.headline}
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ── How it works: the pipeline, one step per scroll ──────────────────── */

const DEMOS: Record<string, (p: { step: number }) => React.ReactNode> = {
  atelier: AtelierDemo,
  dispatch: DispatchDemo,
  bastion: BastionDemo,
  launchpilot: LaunchPilotDemo,
  deeplead: DeepLeadDemo,
  supportagent: SupportAgentDemo,
  voicevault: VoiceVaultDemo,
  paycontrol: PayControlDemo,
};

function Pipeline({ c }: { c: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = c.flow.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setActive((p) => (p === i ? p : i));
  });
  const fill = useTransform(scrollYProgress, (v) => `${clamp01(v) * 100}%`);
  const Demo = DEMOS[c.slug];
  // clicking a step scrolls to the middle of that step's stretch of the section
  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / n) * run, behavior: "smooth" });
  };

  return (
    <section className="v2-night relative">
      <div className="px-[5vw] pt-[14vh] md:px-[9vw]">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--night-muted)]">How it works</p>
        <h2 className="v2-display mt-6 text-[13vw] md:text-[6.5vw]">
          <MaskLine>Six steps,</MaskLine>
          <MaskLine delay={0.08}>
            <span className="v2-gold">one system.</span>
          </MaskLine>
        </h2>
      </div>
      <div ref={ref} className="relative" style={{ height: `${n * 70}svh` }}>
        <div className="sticky top-0 flex h-[100svh] items-center px-[5vw] md:px-[9vw]">
          <div className="grid w-full items-center gap-8 md:grid-cols-[0.9fr_1.3fr] md:gap-[5vw]">
            {/* steps */}
            <div className="relative">
              <div className="absolute bottom-2 left-[0.55rem] top-2 w-px bg-white/10">
                <motion.div className="w-full bg-[var(--gold)]" style={{ height: fill }} />
              </div>
              <ol className="space-y-1">
                {c.flow.map((step, i) => (
                  <li
                    key={step}
                    onClick={() => goTo(i)}
                    className={`flex cursor-pointer items-baseline gap-5 py-2 transition-[opacity,transform] duration-500 hover:opacity-80 ${
                      i === active ? "translate-x-1 opacity-100" : i < active ? "opacity-45" : "opacity-25"
                    }`}
                  >
                    <span
                      className={`relative z-[1] mt-1 size-[1.15rem] shrink-0 rounded-full border transition-colors duration-500 ${
                        i <= active ? "border-[var(--gold)] bg-[var(--gold)]" : "border-white/30 bg-[var(--night)]"
                      }`}
                    />
                    <span>
                      <span className="block font-mono text-[11px] text-[var(--night-muted)]">{pad(i + 1)}</span>
                      <span className="block text-2xl tracking-[-0.03em] md:text-[2vw]">{step}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            {/* the live scene and the current step */}
            <div>
              <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[var(--night-2)] shadow-[0_40px_120px_-50px_rgba(0,0,0,0.9)]">
                {/* window bar */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
                  <span className="flex items-center gap-3">
                    <span className="flex gap-1.5">
                      <span className="size-2.5 rounded-full bg-white/15" />
                      <span className="size-2.5 rounded-full bg-white/15" />
                      <span className="size-2.5 rounded-full bg-white/15" />
                    </span>
                    <span className="font-mono text-[11px] text-white/60">{c.name.toLowerCase()} · run</span>
                  </span>
                  <span className="overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={active}
                        initial={{ y: "120%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-120%" }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="block font-mono text-[11px] text-[var(--gold)]"
                      >
                        Step {pad(active + 1)} · {c.flow[active]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </div>
                {/* the demo for this step */}
                <div className="relative aspect-[16/11] md:aspect-[16/10]">
                  <Demo step={active} />
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-2.5">
                  <span className="flex gap-1.5">
                    {c.flow.map((_, i) => (
                      <span
                        key={i}
                        className="h-1 rounded-full transition-all duration-500"
                        style={{ width: i === active ? 22 : 8, background: i <= active ? "var(--gold)" : "rgba(255,255,255,0.15)" }}
                      />
                    ))}
                  </span>
                  <span className="font-mono text-[10px] text-white/35">Simulated run · illustrative data</span>
                </div>
              </div>
              <div className="mt-6 min-h-[5.5rem]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={active}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="max-w-xl text-lg leading-snug text-[var(--night-ink)]/85 md:text-xl"
                  >
                    {c.steps[active]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Inside: the four parts of the architecture ───────────────────────── */

function Inside({ c }: { c: CaseStudy }) {
  return (
    <section className="v2-night v2-spot v2-grain relative px-[5vw] py-[16vh] md:px-[9vw]" {...spotHandlers()}>
      <div className="relative z-[2]">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--night-muted)]">Inside</p>
        <h2 className="v2-display mt-6 max-w-[14ch] text-[12vw] md:text-[5.5vw]">
          <MaskLine>What I built,</MaskLine>
          <MaskLine delay={0.08}>layer by layer.</MaskLine>
        </h2>
        <div className="mt-16 grid gap-px overflow-hidden rounded-[24px] bg-white/[0.08] md:grid-cols-2">
          {c.architecture.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, ease: EASE, delay: (i % 2) * 0.08 }}
              className="group relative bg-[var(--night-2)] p-8 transition-colors duration-500 hover:bg-[var(--night-3)] md:p-12"
            >
              <p className="v2-display text-6xl text-[var(--gold)]/80 md:text-7xl">{pad(i + 1)}</p>
              <p className="mt-8 text-2xl font-medium tracking-[-0.03em]">{a.title}</p>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--night-muted)]">{a.body}</p>
              <span className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-[var(--gold)] transition-transform duration-700 group-hover:scale-x-100 md:inset-x-12" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Decisions: the calls that shaped it ──────────────────────────────── */

function Decisions({ c }: { c: CaseStudy }) {
  return (
    <section className="bg-[var(--day)] px-[5vw] py-[16vh] text-[var(--ink)] md:px-[9vw]">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Engineering decisions</p>
      <div className="mt-14 space-y-[10vh]">
        {c.decisions.map((d, i) => (
          <div key={d.title} className={`grid gap-6 md:grid-cols-[6rem_1fr] ${i % 2 ? "md:ml-[14vw]" : ""}`}>
            <p className="font-mono text-sm text-[var(--muted)]">{pad(i + 1)}</p>
            <div>
              <h3 className="v2-display text-[10vw] leading-[0.95] md:text-[4.6vw]">
                <MaskLine>{d.title}</MaskLine>
              </h3>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
                className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]"
              >
                {d.body}
              </motion.p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Scale, stack and ownership ───────────────────────────────────────── */

function Built({ c }: { c: CaseStudy }) {
  const row = [...c.stack, ...c.stack];
  return (
    <section className="v2-night v2-grain relative overflow-hidden py-[14vh]">
      <div className="relative z-[2] px-[5vw] md:px-[9vw]">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--night-muted)]">Scale of the codebase</p>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {c.metrics.map((m) => (
            <div key={m.label} className="border-t border-white/12 pt-5">
              <p className="v2-display text-[13vw] md:text-[5.5vw]">{m.value}</p>
              <p className="mt-3 text-[15px] text-[var(--night-muted)]">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-[2] mt-[12vh] flex w-max animate-[v2-marquee_38s_linear_infinite] gap-3 motion-reduce:animate-none">
        {row.map((s, i) => (
          <span key={i} className="rounded-full border border-white/12 px-5 py-2.5 font-mono text-sm text-[var(--night-ink)]/80">
            {s}
          </span>
        ))}
      </div>

      <div className="relative z-[2] mt-[12vh] grid gap-8 px-[5vw] md:grid-cols-[1fr_1fr] md:px-[9vw]">
        <p className="text-2xl leading-snug tracking-[-0.025em] md:text-3xl">{c.ownership}</p>
        <p className="self-end font-mono text-xs leading-relaxed text-[var(--night-muted)]">{c.evidence}</p>
      </div>
    </section>
  );
}

/* ── Next case ────────────────────────────────────────────────────────── */

function Next({ next }: { next: CaseStudy }) {
  return (
    <Link href={`/lab/v2/systems/${next.slug}`} className="group relative block h-[80svh] overflow-hidden bg-[var(--night)] text-[var(--night-ink)]">
      <video
        src={`/videos/v2/systems/${next.film}.mp4`}
        poster={`/videos/v2/systems/${next.film}.jpg`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-40 transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105 group-hover:opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--night)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 px-[5vw] pb-[12vh] md:px-[9vw]">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Next case</p>
        <p className="v2-display mt-4 text-[19vw] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-4 md:text-[11vw]">
          {next.name} →
        </p>
      </div>
    </Link>
  );
}

export default function CaseStudyView({
  study,
  next,
  index,
  total,
}: {
  study: CaseStudy;
  next: CaseStudy;
  index: number;
  total: number;
}) {
  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-[5vw] py-6 text-white mix-blend-difference md:px-[2.4vw]">
        <Link href="/" className="pointer-events-auto text-lg tracking-[-0.02em]">
          Relja Bulajić
        </Link>
        <Link href="/?view=ai" className="pointer-events-auto text-sm opacity-80 hover:opacity-100">
          ← All systems
        </Link>
      </header>
      <main>
        <Opening c={study} index={index} total={total} />
        <section className="v2-night">
          <p className="px-[5vw] pt-[16vh] text-sm uppercase tracking-[0.2em] text-[var(--night-muted)] md:px-[9vw]">
            The problem
          </p>
          <Statement text={study.problem} highlight={false} className="px-[5vw] pb-[12vh] pt-[5vh] md:px-[9vw]" />
        </section>
        <Pipeline c={study} />
        <Inside c={study} />
        <Decisions c={study} />
        <Built c={study} />
        <Next next={next} />
      </main>
    </>
  );
}
