"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatReviewDates, ratingOnly, reviews, UPWORK_PROFILE_URL } from "@/lib/reviews";
import { EASE, MaskLine } from "./Hero";
import { spotHandlers } from "./Practices";

// Upwork totals, read from the Upwork API on Oct 20, 2026 (profileAggregates).
const STATS = [
  ["Top Rated", "Upwork badge"],
  ["100%", "Job Success"],
  ["14", "contracts"],
];

function Star({ i, on, size = 22 }: { i: number; on: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path
        d="M12 2.8l2.75 5.57 6.15.9-4.45 4.34 1.05 6.12L12 16.85l-5.5 2.88 1.05-6.12L3.1 9.27l6.15-.9L12 2.8z"
        fill="rgba(255,255,255,0.1)"
      />
      <motion.path
        d="M12 2.8l2.75 5.57 6.15.9-4.45 4.34 1.05 6.12L12 16.85l-5.5 2.88 1.05-6.12L3.1 9.27l6.15-.9L12 2.8z"
        fill="var(--gold)"
        initial={{ scale: 0, opacity: 0 }}
        animate={on ? { scale: 1, opacity: 1 } : {}}
        style={{ transformOrigin: "12px 12px" }}
        transition={{ delay: i * 0.12, type: "spring", stiffness: 420, damping: 14 }}
      />
    </svg>
  );
}

const AUTO_MS = 8000;

// Every rated contract, newest first: written reviews link to their quote.
const LEDGER = [
  ...reviews.map((r, idx) => ({ project: r.project, start: r.start, end: r.end, score: r.score, idx })),
  ...ratingOnly.map((r) => ({ project: r.project, start: r.start, end: r.end, score: r.score, idx: -1 })),
].sort((a, b) => b.end.localeCompare(a.end));

export default function Reviews() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const n = reviews.length;
  const r = reviews[i];

  const go = (next: number) => {
    setDir(next > i || (i === n - 1 && next === 0) ? 1 : -1);
    setI((next + n) % n);
  };

  // advance on a timer while visible, unless the visitor is reading
  useEffect(() => {
    if (n < 2 || paused || reduced || !inView) return;
    const t = setTimeout(() => go(i + 1), AUTO_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, paused, reduced, inView, n]);

  return (
    <section
      ref={ref}
      className="v2-night v2-spot v2-grain relative px-[5vw] py-[16vh] md:px-[9vw]"
      {...spotHandlers()}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="relative z-[2]">
        {/* headline: the rating, the stars filling in, and the totals */}
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--night-muted)]">Client reviews</p>
            <div className="mt-6 flex items-end gap-6">
              <span className="v2-display text-[26vw] leading-[0.8] md:text-[11vw]">
                <MaskLine>5.0</MaskLine>
              </span>
              <span className="mb-[1.2vw] flex gap-1">
                {[0, 1, 2, 3, 4].map((k) => (
                  <Star key={k} i={k} on={inView} size={30} />
                ))}
              </span>
            </div>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--night-muted)]">
              Every client who left a rating on Upwork gave five stars. Quoted word for word.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {STATS.map(([v, l], k) => (
              <motion.div
                key={l}
                className="border-t border-white/12 pt-4"
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + k * 0.1, duration: 0.7, ease: EASE }}
              >
                <p className="text-2xl tracking-[-0.03em] md:text-3xl">{v}</p>
                <p className="mt-1 text-[13px] text-[var(--night-muted)]">{l}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* the review, one at a time */}
        <div className="relative mt-[10vh] min-h-[28rem] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[var(--night-2)] p-7 md:min-h-[24rem] md:p-12">
          <span className="v2-display pointer-events-none absolute -top-[0.2em] right-6 select-none text-[16rem] leading-none text-[var(--gold)]/10 md:text-[22rem]">
            ”
          </span>
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.figure
              key={i}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: dir * -60, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative"
            >
              <div className="flex gap-1">
                {Array.from({ length: r.score }).map((_, k) => (
                  <Star key={k} i={k} on size={18} />
                ))}
              </div>
              <blockquote className="mt-6 max-w-4xl text-2xl leading-[1.25] tracking-[-0.025em] md:text-[2.4vw]">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-lg">{r.client}</p>
                  <p className="mt-1 text-[14px] text-[var(--night-muted)]">
                    {r.project} · {formatReviewDates(r.start, r.end)}
                  </p>
                  {r.endorsements && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {r.endorsements.map((e) => (
                        <span key={e} className="rounded-full border border-[var(--gold)]/30 px-3 py-1 font-mono text-[11px] text-[var(--gold)]">
                          {e}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <a
                  href={r.verifyUrl ?? UPWORK_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 text-sm text-[var(--night-ink)]/80 hover:text-[var(--night-ink)]"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#14a800] text-[10px] text-white">✓</span>
                  Verified on Upwork ↗
                </a>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* controls, only when there is more than one review */}
        {n > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              {reviews.map((_, k) => (
                <button
                  key={k}
                  type="button"
                  aria-label={`Review ${k + 1}`}
                  onClick={() => go(k)}
                  className="relative h-1 overflow-hidden rounded-full bg-white/15 transition-[width] duration-500"
                  style={{ width: k === i ? 56 : 18 }}
                >
                  {k === i && (
                    <motion.span
                      key={`${i}-${paused}`}
                      className="absolute inset-y-0 left-0 bg-[var(--gold)]"
                      initial={{ width: "0%" }}
                      animate={{ width: paused || reduced ? "0%" : "100%" }}
                      transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {[
                ["←", -1],
                ["→", 1],
              ].map(([label, d]) => (
                <button
                  key={label as string}
                  type="button"
                  onClick={() => go(i + (d as number))}
                  className="flex size-12 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  aria-label={d === 1 ? "Next review" : "Previous review"}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* the full record */}
        <div className="mt-[10vh]">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--night-muted)]">
            Every rated contract · {LEDGER.length} of {LEDGER.length} at 5.0
          </p>
          <ul className="mt-6 border-t border-white/10">
            {LEDGER.map((row, k) => (
              <motion.li
                key={row.project}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.6, ease: EASE, delay: k * 0.06 }}
                className="border-b border-white/10"
              >
                <button
                  type="button"
                  disabled={row.idx < 0}
                  onClick={() => {
                    if (row.idx < 0) return;
                    go(row.idx);
                    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 py-5 text-left md:grid-cols-[1fr_12rem_auto]"
                >
                  <span className={`text-[15px] transition-colors md:text-lg ${row.idx === i ? "text-[var(--gold)]" : "text-[var(--night-ink)]/85 group-enabled:group-hover:text-[var(--night-ink)]"}`}>
                    {row.project}
                  </span>
                  <span className="hidden font-mono text-xs text-[var(--night-muted)] md:block">{formatReviewDates(row.start, row.end)}</span>
                  <span className="flex items-center gap-2">
                    <span className="flex gap-0.5">
                      {[0, 1, 2, 3, 4].map((s2) => (
                        <svg key={s2} viewBox="0 0 24 24" width={12} height={12} aria-hidden>
                          <path d="M12 2.8l2.75 5.57 6.15.9-4.45 4.34 1.05 6.12L12 16.85l-5.5 2.88 1.05-6.12L3.1 9.27l6.15-.9L12 2.8z" fill="var(--gold)" />
                        </svg>
                      ))}
                    </span>
                    <span className="font-mono text-xs text-[var(--night-ink)]/80">{row.score.toFixed(1)}</span>
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
