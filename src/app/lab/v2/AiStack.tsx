"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { aiCases } from "./data";
import { EASE, MaskLine } from "./Hero";
import { spotHandlers } from "./Practices";

const pad = (n: number) => String(n).padStart(2, "0");
const WORDS: Record<number, string> = { 5: "Five", 6: "Six", 7: "Seven", 8: "Eight" };

/**
 * The AI systems as one stage: a list on the left that follows the scroll,
 * and one card on the right with that system's film, what it does and its
 * six steps. Click a name to jump to it.
 */
export default function AiStack() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const n = aiCases.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setActive((p) => (p === i ? p : i));
  });
  // computed in JS so framer-motion keeps it off the browser's ScrollTimeline
  const fill = useTransform(scrollYProgress, (v) => `${Math.min(1, Math.max(0, v)) * 100}%`);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / n) * run, behavior: reduced ? "auto" : "smooth" });
  };

  const c = aiCases[active];

  return (
    <section id="v2-ai" className="v2-night v2-spot v2-grain relative" {...spotHandlers()}>
      <div className="relative z-[2] px-[5vw] pb-[2vh] pt-[16vh] md:px-[9vw]">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--night-muted)]">01 · AI systems</p>
        <h2 className="v2-display mt-6 text-[14vw] md:text-[8vw]">
          <MaskLine>
            My <span className="v2-gold">work.</span>
          </MaskLine>
        </h2>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--night-muted)]">
          {WORDS[n] ?? n} AI systems I designed and built myself, end to end. Here is what each one does.
        </p>
      </div>

      <div ref={ref} className="relative z-[2]" style={{ height: `${n * 50}svh` }}>
        <div className="sticky top-0 flex h-[100svh] items-center px-[5vw] md:px-[9vw]">
          <div className="grid w-full items-center gap-8 md:grid-cols-[0.8fr_1.4fr] md:gap-[4vw]">
            {/* the list */}
            <div className="relative hidden md:block">
              <div className="absolute bottom-3 left-0 top-3 w-px bg-white/10">
                <motion.div className="w-full bg-[var(--gold)]" style={{ height: fill }} />
              </div>
              <ol className="space-y-3 pl-7">
                {aiCases.map((s, i) => (
                  <li key={s.slug}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      className={`block text-left transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-30 hover:opacity-60"}`}
                    >
                      <span className="block font-mono text-[11px] text-[var(--night-muted)]">{pad(i + 1)}</span>
                      <span className="block text-[2.9vw] leading-[1.05] tracking-[-0.045em]">{s.name}</span>
                      <span className="mt-1 block text-[13px] text-[var(--night-muted)]">{s.category}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            {/* the card */}
            <Link
              href={c.href}
              className="group relative block overflow-hidden rounded-[26px] border border-white/[0.08] bg-[var(--night-2)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <AnimatePresence initial={false}>
                  <motion.video
                    key={c.slug}
                    src={`/videos/v2/systems/${c.slug}.mp4`}
                    poster={`/videos/v2/systems/${c.slug}.jpg`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--night-2)] via-transparent to-transparent" />
                <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[11px] text-white/80 backdrop-blur-md">
                  {pad(active + 1)} / {pad(n)}
                </span>
              </div>

              <div className="relative p-6 md:p-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={c.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--gold)] md:hidden">{c.category}</p>
                    <p className="text-3xl tracking-[-0.04em] md:hidden">{c.name}</p>
                    <p className="mt-2 max-w-2xl text-xl leading-snug tracking-[-0.02em] md:mt-0 md:text-2xl">{c.headline}</p>
                    {/* what it does, in three plain points, then what it gets you */}
                    <ul className="mt-5 space-y-2">
                      {c.does.map((d) => (
                        <li key={d} className="flex gap-3 text-[15px] leading-snug text-[var(--night-ink)]/80">
                          <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-[15px] text-[var(--gold)]">{c.gives}</p>
                  </motion.div>
                </AnimatePresence>
                <span className="mt-6 inline-flex items-center gap-3 text-sm text-[var(--gold)]">
                  Open the case study
                  <span className="flex size-9 items-center justify-center rounded-full border border-[var(--gold)]/40 transition-[transform,background-color,color] duration-500 group-hover:translate-x-1 group-hover:bg-[var(--gold)] group-hover:text-[var(--gold-ink)]">
                    →
                  </span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
