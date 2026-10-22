"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { formatReviewDates, ratingOnly, reviews, UPWORK_PROFILE_URL, type ClientReview } from "@/lib/reviews";
import { EASE, MaskLine } from "./Hero";
import { spotHandlers } from "./Practices";

// Upwork totals, read from the Upwork API on Oct 20, 2026 (profileAggregates).
const STATS = [
  ["Top Rated", "Upwork badge"],
  ["100%", "Job Success"],
  ["14", "contracts"],
];

// The line a skimming reader should catch in each review. Each one is a
// verbatim substring of that client's quote, so the quote stays word for word.
const PULL: Record<string, string> = {
  "Michael R.": "will hire him for my next project",
  "Hendrik S.": "he thinks ahead and brings great ideas to the table",
  "Hrvoje L.": "His speed and attention to detail truly stood out.",
  "Sameh M.": "delivered exactly what was promised",
  "AI Group": "helped me a lot to resolve the issue I was facing",
};

const RATED = reviews.length + ratingOnly.length;

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

/** The quote with its pull line lit, the rest of it quiet. */
function Quote({ r }: { r: ClientReview }) {
  const pull = PULL[r.client];
  const at = pull ? r.quote.indexOf(pull) : -1;
  if (at < 0) return <>{r.quote}</>;
  return (
    <>
      <span className="text-[var(--night-muted)]">{r.quote.slice(0, at)}</span>
      <span className="text-[var(--night-ink)]">{pull}</span>
      <span className="text-[var(--night-muted)]">{r.quote.slice(at + pull.length)}</span>
    </>
  );
}

function ReviewCard({ r, featured, k }: { r: ClientReview; featured: boolean; k: number }) {
  return (
    <motion.figure
      className={`relative flex w-[84vw] shrink-0 snap-start flex-col rounded-[26px] border border-white/[0.08] bg-[var(--night-2)] p-7 transition-colors hover:border-[var(--gold)]/35 md:w-auto md:p-9 ${
        featured ? "md:col-span-2" : ""
      }`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay: (k % 3) * 0.08 }}
    >
      <div className="flex items-center justify-between">
        <span className="flex gap-0.5">
          {Array.from({ length: r.score }).map((_, s) => (
            <Star key={s} i={s} on size={15} />
          ))}
        </span>
        <a
          href={r.verifyUrl ?? UPWORK_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[12px] text-[var(--night-muted)] transition-colors hover:text-[var(--night-ink)]"
        >
          <span className="flex size-4 items-center justify-center rounded-full bg-[#14a800] text-[9px] text-white">✓</span>
          Verified on Upwork
        </a>
      </div>
      <blockquote
        className={`mt-6 flex-1 tracking-[-0.02em] ${
          featured ? "text-[21px] leading-[1.32] md:text-[1.5vw]" : "text-[18px] leading-[1.4] md:text-[1.2vw]"
        }`}
      >
        &ldquo;<Quote r={r} />&rdquo;
      </blockquote>
      <figcaption className="mt-7 border-t border-white/[0.08] pt-5">
        <p className="text-[15px]">{r.client}</p>
        <p className="mt-1 line-clamp-1 text-[13px] text-[var(--night-muted)]">
          {r.project} · {formatReviewDates(r.start, r.end)}
        </p>
        {featured && r.endorsements && (
          <div className="mt-4 flex flex-wrap gap-2">
            {r.endorsements.map((e) => (
              <span key={e} className="rounded-full border border-[var(--gold)]/30 px-3 py-1 font-mono text-[11px] text-[var(--gold)]">
                {e}
              </span>
            ))}
          </div>
        )}
      </figcaption>
    </motion.figure>
  );
}

/**
 * Upwork reviews as a wall you can skim: the rating and totals up top, then
 * every written review with its key line lit. Side-scrolls on phones.
 */
export default function Reviews() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section ref={ref} className="v2-night v2-spot v2-grain relative px-[5vw] py-[14vh] md:px-[9vw]" {...spotHandlers()}>
      <div className="relative z-[2]">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--night-muted)]">Client reviews</p>
            <div className="mt-6 flex items-end gap-5">
              <span className="v2-display text-[24vw] leading-[0.8] md:text-[8.5vw]">
                <MaskLine>5.0</MaskLine>
              </span>
              <span className="mb-[0.9vw] flex gap-1">
                {[0, 1, 2, 3, 4].map((k) => (
                  <Star key={k} i={k} on={inView} size={26} />
                ))}
              </span>
            </div>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--night-muted)]">
              Every client who rated me on Upwork gave five stars. Quoted word for word.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 md:w-[30rem]">
            {STATS.map(([v, l], k) => (
              <motion.div
                key={l}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-4"
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + k * 0.1, duration: 0.7, ease: EASE }}
              >
                <p className="text-xl tracking-[-0.03em] md:text-2xl">{v}</p>
                <p className="mt-1 text-[12px] text-[var(--night-muted)]">{l}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="-mx-[5vw] mt-[8vh] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[5vw] pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0">
          {reviews.map((r, k) => (
            <ReviewCard key={r.client} r={r} featured={k === 0} k={k} />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 text-[14px] text-[var(--night-muted)] md:flex-row md:items-center md:justify-between">
          <p>
            {RATED} clients left a rating, and every rating is 5.0.
          </p>
          <a
            href={UPWORK_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--night-ink)]/80 transition-colors hover:text-[var(--gold)]"
          >
            See every review on Upwork ↗
          </a>
        </div>
      </div>
    </section>
  );
}
