"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "./Hero";

/** Pointer-follow light for dark sections (sets --mx/--my on the element). */
export function spotHandlers() {
  return {
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    },
  };
}

type Side = "ai" | "ios";

/**
 * A film of Relja behind each practice. Idle it rests muted in black and
 * white; when the panel is hovered it plays in colour. On touch screens it
 * simply plays while on screen.
 */
function PanelVideo({ src, poster, active }: { src: string; poster: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const on = () => setTouch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active || touch) v.play().catch(() => {});
    else v.pause();
  }, [active, touch]);
  const lit = active || touch;
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-[filter,transform] duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] ${
        lit ? "scale-100 grayscale-0" : "scale-[1.04] grayscale brightness-[0.8]"
      }`}
    />
  );
}

/**
 * Two practices, side by side. The hovered side opens up; each one leads to
 * its own world further down: AI systems in the dark, iOS apps in the light.
 */
export default function Practices({ onPick }: { onPick: (side: Side) => void }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<Side | null>(null);
  const grow = (side: Side) => (open === null ? 1 : open === side ? 1.55 : 0.75);

  return (
    <section className="px-[3vw] pb-[10vh]">
      <div className="mb-8 flex items-end justify-between px-[2vw]">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Two practices</p>
        <p className="hidden text-sm text-[var(--muted)] md:block">Pick one, or scroll for both</p>
      </div>
      <div
        className="flex h-auto flex-col gap-3 md:h-[78svh] md:flex-row"
        onPointerLeave={() => setOpen(null)}
      >
        {/* AI */}
        <motion.button
          type="button"
          onPointerEnter={() => setOpen("ai")}
          onClick={() => onPick("ai")}
          animate={{ flexGrow: reduced ? 1 : grow("ai") }}
          transition={{ duration: 0.8, ease: EASE }}
          {...spotHandlers()}
          className="v2-night v2-spot v2-grain group relative flex min-h-[70svh] basis-0 flex-col justify-between overflow-hidden rounded-[28px] p-7 text-left md:min-h-0 md:p-10"
        >
          <PanelVideo src="/videos/v2/ai.mp4" poster="/videos/v2/ai.jpg" active={open === "ai"} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--night)] via-[var(--night)]/45 to-transparent" />
          <span className="relative z-[2] font-mono text-xs text-[var(--night-muted)]">01</span>
          <span className="relative z-[2]">
            <span className="v2-display block text-[13vw] md:text-[5.6vw]">AI Engineering</span>
            <span className="mt-4 block max-w-sm text-[15px] leading-relaxed text-[var(--night-muted)]">
              Agents and backends that touch real money and real customers, with approval, audit
              and evals built in.
            </span>
            <span className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--gold)]">
              See the systems <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </span>
          </span>
        </motion.button>

        {/* iOS */}
        <motion.button
          type="button"
          onPointerEnter={() => setOpen("ios")}
          onClick={() => onPick("ios")}
          animate={{ flexGrow: reduced ? 1 : grow("ios") }}
          transition={{ duration: 0.8, ease: EASE }}
          className="group relative flex min-h-[70svh] basis-0 flex-col justify-between overflow-hidden rounded-[28px] bg-[var(--day-2)] p-7 text-left md:min-h-0 md:p-10"
        >
          <PanelVideo src="/videos/v2/ios.mp4" poster="/videos/v2/ios.jpg" active={open === "ios"} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--day-2)] via-[var(--day-2)]/50 to-transparent" />
          <span className="relative z-[2] font-mono text-xs text-[var(--muted)]">02</span>
          <span className="relative z-[2]">
            <span className="v2-display block text-[13vw] md:text-[5.6vw]">iOS Apps</span>
            <span className="mt-4 block max-w-sm text-[15px] leading-relaxed text-[var(--muted)]">
              Native SwiftUI apps, designed, built and shipped to the App Store by one person.
            </span>
            <span className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--ink)]">
              See the apps <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </span>
          </span>
        </motion.button>
      </div>
    </section>
  );
}
