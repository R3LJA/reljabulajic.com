"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DeviceFrame from "@/components/DeviceFrame";
import Reveal from "@/components/Reveal";

export type ShowcaseApp = {
  slug: string;
  name: string;
  file: string;
  accent: string;
  screenshot?: string;
  code: string[];
};

/* ── tiny Xcode-dark syntax highlighter ── */
const KEYWORDS =
  /\b(import|struct|var|let|some|private|func|return|in|await|async)\b/;

function Token({ text }: { text: string }) {
  if (/^\/\//.test(text)) return <span style={{ color: "var(--xc-comment)" }}>{text}</span>;
  if (/^"/.test(text)) return <span style={{ color: "var(--xc-str)" }}>{text}</span>;
  if (KEYWORDS.test(text) && !/[A-Z]/.test(text[0]))
    return <span style={{ color: "var(--xc-kw)" }}>{text}</span>;
  if (/^@/.test(text)) return <span style={{ color: "var(--xc-kw)" }}>{text}</span>;
  if (/^\.[a-z]/.test(text)) return <span style={{ color: "var(--xc-mod)" }}>{text}</span>;
  if (/^[A-Z][A-Za-z0-9]*$/.test(text))
    return <span style={{ color: "var(--xc-type)" }}>{text}</span>;
  if (/^\d/.test(text)) return <span style={{ color: "var(--xc-num)" }}>{text}</span>;
  return <span style={{ color: "var(--xc-text)" }}>{text}</span>;
}

function CodeLine({ line }: { line: string }) {
  // split into highlightable tokens: comments, strings, words, dot-modifiers, rest
  const tokens =
    line.match(/\/\/.*$|"[^"]*"|@?\w+|\.[a-z]\w*|[^\w@.]+|\./g) ?? [];
  return (
    <>
      {tokens.map((t, i) => (
        <Token key={i} text={t} />
      ))}
    </>
  );
}

export default function XcodeShowcase({ items }: { items: ShowcaseApp[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = items[idx];

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  return (
    <section className="mt-32">
      <Reveal>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Straight from <span className="serif-accent text-accent">Xcode</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            The same view, twice: the SwiftUI that ships, and what your users
            see.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="overflow-hidden rounded-2xl border border-hairline-strong bg-[var(--xc-bg)] shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
        >
          {/* window chrome */}
          <div className="flex items-center gap-3 border-b border-[var(--xc-border)] bg-[var(--xc-chrome)] px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#FF5F57]" />
              <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="size-2.5 rounded-full bg-[#28C840]" />
            </div>
            <span className="hidden text-[11px] text-[var(--xc-title)] sm:block">
              reljabulajic, Xcode
            </span>
            {/* file tabs */}
            <div className="ml-2 flex flex-1 gap-1 overflow-x-auto no-scrollbar">
              {items.map((app, i) => (
                <button
                  key={app.slug}
                  onClick={() => setIdx(i)}
                  className={`relative shrink-0 rounded-md px-3.5 py-1.5 text-[11px] transition-colors ${
                    i === idx
                      ? "bg-[var(--xc-tab-active-bg)] text-[var(--xc-tab-active-text)]"
                      : "text-[var(--xc-tab-text)] hover:text-[var(--xc-tab-active-text)]"
                  }`}
                >
                  <span className="mr-1.5 inline-block size-1.5 rounded-[3px] bg-[var(--xc-type)] align-middle" />
                  {app.file}
                  {i === idx && !paused && (
                    <motion.span
                      key={`progress-${idx}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 7, ease: "linear" }}
                      className="absolute inset-x-1 bottom-0 h-px origin-left rounded-full"
                      style={{ background: app.accent }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.35fr_1fr]">
            {/* editor pane */}
            <div className="relative min-h-[26rem] overflow-hidden border-b border-[var(--xc-border)] bg-[var(--xc-bg)] lg:border-b-0 lg:border-r">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={active.slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.18 } }}
                  className="p-6 font-mono text-[12.5px] leading-[1.75] sm:text-[13px]"
                >
                  {active.code.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.1 + i * 0.05,
                        ease: [0.21, 0.6, 0.35, 1],
                      }}
                      className="flex"
                    >
                      <span className="w-9 shrink-0 select-none pr-4 text-right text-[var(--xc-linenum)]">
                        {i + 1}
                      </span>
                      <span className="whitespace-pre">
                        <CodeLine line={line} />
                      </span>
                    </motion.div>
                  ))}
                </motion.pre>
              </AnimatePresence>
            </div>

            {/* canvas / preview pane */}
            <div className="relative flex flex-col bg-[var(--xc-canvas)]">
              <div className="flex items-center justify-between border-b border-[var(--xc-border)] px-4 py-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--xc-title)]">
                  Canvas
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-[var(--xc-title)]">
                  <span className="size-1.5 rounded-full bg-[#28C840]" />
                  Live Preview
                </span>
              </div>
              <div className="relative flex flex-1 items-center justify-center px-10 py-10">
                {/* accent ambience */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 transition-[background] duration-700"
                  style={{
                    background: `radial-gradient(70% 60% at 50% 45%, ${active.accent}14 0%, transparent 70%)`,
                  }}
                />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.slug}
                    initial={{ opacity: 0, y: 22, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      y: -16,
                      scale: 0.96,
                      transition: { duration: 0.22 },
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 24 }}
                    className="relative w-[180px] sm:w-[200px]"
                  >
                    <DeviceFrame
                      src={active.screenshot}
                      alt={`${active.name} preview`}
                      accent={active.accent}
                      label={active.name}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
