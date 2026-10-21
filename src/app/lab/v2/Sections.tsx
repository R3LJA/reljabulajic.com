"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { UPWORK_PROFILE_URL } from "@/lib/reviews";
import { LINKS, STATEMENT } from "./data";
import { EASE, MaskLine } from "./Hero";

/* ── Statement: words light up as you scroll through them ─────────────── */

function Word({
  word,
  progress,
  range,
  mark,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  mark: boolean;
}) {
  const opacity = useTransform(progress, (v) => 0.14 + 0.86 * ramp(v, range[0], range[1]));
  return (
    <motion.span style={{ opacity }} className={mark ? "text-[var(--gold)]" : undefined}>
      {word}{" "}
    </motion.span>
  );
}

export function Statement({
  text = STATEMENT,
  highlight = true,
  className = "px-[5vw] py-[18vh] md:px-[9vw]",
}: {
  text?: string;
  highlight?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  // "after the demo:" is marked only where it appears together
  const markAt = new Set<number>();
  words.forEach((w, i) => {
    if (highlight && w === "after" && words[i + 1] === "the" && words[i + 2]?.startsWith("demo")) {
      markAt.add(i).add(i + 1).add(i + 2);
    }
  });
  return (
    <section className={className}>
      <p
        ref={ref}
        className="v2-display max-w-[22ch] text-[9vw] leading-[1.02] tracking-[-0.045em] md:text-[4.6vw]"
      >
        {words.map((w, i) =>
          reduced ? (
            <span key={i} className={markAt.has(i) ? "text-[var(--gold)]" : undefined}>
              {w}{" "}
            </span>
          ) : (
            <Word
              key={i}
              word={w}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
              mark={markAt.has(i)}
            />
          ),
        )}
      </p>
    </section>
  );
}

// Scroll-linked opacity is computed in JS on purpose: framer-motion hands plain
// [range] -> [opacity] maps to the browser's ScrollTimeline, which resolved the
// wrong range inside this sticky section.
const ramp = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

/* ── Reel: a pill of the night-office film that opens to full screen ──── */

export function Reel() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useTransform(scrollYProgress, [0, 0.42], [0, 1], { clamp: true });
  const insetY = useTransform(p, [0, 1], [reduced ? 0 : 31, 0]);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  // a pill on wide screens, a tall rounded card on phones
  const insetX = useTransform(p, [0, 1], [reduced ? 0 : narrow ? 6 : 20, 0]);
  const radius = useTransform(p, [0, 0.85, 1], [narrow ? 40 : 999, narrow ? 28 : 120, 0]);
  const clipPath = useTransform(
    [insetY, insetX, radius] as MotionValue<number>[],
    ([y, x, r]: number[]) => `inset(${y}% ${x}% ${y}% ${x}% round ${r}px)`,
  );
  const bg = useTransform(scrollYProgress, [0.18, 0.34], ["#f1eee8", "#0b0b0c"]);
  const titleScale = useTransform(p, [0, 1], [1, 1.5]);
  const titleOpacity = useTransform(p, (v) => 1 - ramp(v, 0.55, 0.85));
  const captionOpacity = useTransform(scrollYProgress, (v) => ramp(v, 0.38, 0.45) * (1 - ramp(v, 0.55, 0.62)));
  // Second act: the camera dives into his laptop and comes out inside the
  // agent graph. The dive film is scrubbed by scroll, frame by frame.
  const diveOpacity = useTransform(scrollYProgress, (v) => ramp(v, 0.5, 0.58));
  const diveRef = useRef<HTMLVideoElement>(null);
  const seekDive = (v: number) => {
    const vid = diveRef.current;
    if (!vid || !vid.duration) return;
    const t = Math.min(1, Math.max(0, (v - 0.55) / 0.42));
    vid.currentTime = t * (vid.duration - 0.05);
  };
  useMotionValueEvent(scrollYProgress, "change", seekDive);
  // if the page lands mid-dive before the film has loaded, catch up once it has
  useEffect(() => {
    const vid = diveRef.current;
    if (!vid) return;
    const onReady = () => seekDive(scrollYProgress.get());
    vid.addEventListener("loadedmetadata", onReady);
    return () => vid.removeEventListener("loadedmetadata", onReady);
  });
  const diveCaption = useTransform(scrollYProgress, (v) => ramp(v, 0.82, 0.92));
  const videoScale = useTransform(p, [0, 1], [1.35, 1]);

  return (
    <motion.div ref={ref} style={{ backgroundColor: bg }} className="relative h-[460vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath }}>
          <motion.video
            src="/videos/v2/night.mp4"
            poster="/videos/v2/night.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{ scale: videoScale }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ scale: titleScale, opacity: titleOpacity }}
        >
          <span className="v2-display text-center text-[16vw] text-white md:text-[9.5vw]">
            Night shift
          </span>
        </motion.div>
        <motion.p
          style={{ opacity: captionOpacity }}
          className="absolute bottom-32 left-[5vw] right-[5vw] max-w-md text-sm leading-relaxed text-white/80 md:bottom-10 md:left-[9vw]"
        >
          Belgrade, after hours. The agents run, I review what they want to do.
        </motion.p>
        <motion.video
          ref={diveRef}
          src="/videos/v2/dive.mp4"
          poster="/videos/v2/dive.jpg"
          muted
          playsInline
          preload="auto"
          style={{ opacity: diveOpacity }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <motion.p
          style={{ opacity: diveCaption }}
          className="v2-display absolute bottom-[14vh] left-[5vw] right-[5vw] text-[11vw] text-white md:left-[9vw] md:text-[5.5vw]"
        >
          Inside the <span className="v2-gold">system.</span>
        </motion.p>
      </div>
    </motion.div>
  );
}

/* ── Numbers: verified, counting up once ──────────────────────────────── */

function Count({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => `${v.toFixed(decimals)}${suffix}`);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration: reduced ? 0 : 1.6, ease: EASE });
    return () => controls.stop();
  }, [inView, reduced, to, value]);
  return <motion.span ref={ref}>{text}</motion.span>;
}

const NUMBERS = [
  { node: <Count to={100} suffix="%" />, label: "Job Success on Upwork, Top Rated" },
  { node: <Count to={5} decimals={1} />, label: "every client review" },
  { node: <Count to={14} />, label: "Upwork contracts delivered" },
  { node: <Count to={10} />, label: "of my own apps live on the App Store" },
];

export function Numbers() {
  return (
    <section className="v2-night px-[5vw] py-[16vh] md:px-[9vw]">
      <p className="mb-14 text-sm uppercase tracking-[0.2em] text-[var(--night-muted)]">On record</p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4">
        {NUMBERS.map((n, i) => (
          <div key={i} className="border-t border-white/12 pt-6">
            <p className="v2-display text-[17vw] md:text-[7.5vw]">{n.node}</p>
            <p className="mt-4 max-w-[14rem] text-[15px] leading-snug text-[var(--night-muted)]">
              {n.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Close: back to the proposal ──────────────────────────────────────── */

export function FooterLinks({ dark = true }: { dark?: boolean }) {
  const links = [
    { label: "GitHub", href: LINKS.github },
    { label: "App Store", href: LINKS.appStore },
    { label: "Upwork", href: UPWORK_PROFILE_URL },
  ];
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3 text-[15px]">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative inline-flex items-center gap-1.5 ${dark ? "text-[var(--night-ink)]" : "text-[var(--ink)]"}`}
        >
          {l.label}
          <span className="text-xs opacity-50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
          <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
        </a>
      ))}
    </div>
  );
}

export function Close() {
  return (
    <section className="v2-night v2-grain relative overflow-hidden px-[5vw] pb-36 pt-[16vh] md:px-[9vw]">
      {/* the original portrait, cut out, on a warm studio light instead of the white wall */}
      <div className="pointer-events-none absolute bottom-[9rem] right-0 hidden h-[78%] w-[42vw] md:block">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 55% 45%, rgba(203,180,138,0.38), rgba(203,180,138,0.08) 55%, transparent 75%)",
          }}
        />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <Image
            src="/photos/relja-cutout.webp"
            alt="Relja Bulajić"
            fill
            sizes="42vw"
            className="object-contain object-bottom [filter:saturate(0.9)_contrast(1.05)] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
          />
        </motion.div>
      </div>
      <div className="v2-display relative text-[13vw] md:text-[8.4vw]">
        <MaskLine>Let&apos;s build</MaskLine>
        <MaskLine delay={0.1}>
          the part <span className="v2-gold">after</span>
        </MaskLine>
        <MaskLine delay={0.2}>the demo.</MaskLine>
      </div>
      <div className="relative mt-20 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-2xl tracking-[-0.03em]">Relja Bulajić</p>
          <p className="mt-2 text-[15px] text-[var(--night-muted)]">AI Engineer and iOS Developer, Belgrade</p>
        </div>
        <FooterLinks />
      </div>
    </section>
  );
}
