"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, MotionConfig, useInView, useReducedMotion } from "framer-motion";

/* ────────────────────────────────────────────────────────────────────────────
   Shared machinery for the flagship-system scenes.

   Every scene is a small choreographed "live demo" of the real system:
   a HUD-style viewport, a phase loop that tells the story, beams that move
   data between components, and micro-copy that types itself.
   ──────────────────────────────────────────────────────────────────────────── */

export type SceneProps = {
  slug: string;
  accent: string;
  /** trimmed-down variant used by lower cards in the listing */
  compact?: boolean;
  /** full variant for the case-study hero: bottom log + phase tracker */
  detail?: boolean;
};

/* scenes pause their loops when scrolled out of view */
const SceneActiveContext = createContext(true);

export function useSceneActive() {
  return useContext(SceneActiveContext);
}

/**
 * Steps through `durations.length` phases, holding phase i for durations[i] ms.
 * Pass the array as a module-level constant so the effect stays stable.
 * Freezes on phase 0 for reduced motion and while off-screen.
 */
export function useSequence(durations: readonly number[]) {
  const active = useSceneActive();
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active || reduced) return;
    const id = setTimeout(
      () => setStep((s) => (s + 1) % durations.length),
      durations[step],
    );
    return () => clearTimeout(id);
  }, [step, active, reduced, durations]);
  return step;
}

/** Types `text` character by character; instant for reduced motion. */
export function TypeText({
  text,
  speed = 24,
  delay = 0,
  className,
  style,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const active = useSceneActive();
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  const showAll = Boolean(reduced) || !active;
  useEffect(() => {
    if (showAll) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      setN(0);
      interval = setInterval(() => {
        setN((v) => {
          if (v >= text.length && interval) clearInterval(interval);
          return Math.min(v + 1, text.length);
        });
      }, speed);
    }, delay);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, delay, showAll]);
  const shown = showAll ? text.length : n;
  return (
    <span className={className} style={style}>
      {text.slice(0, shown)}
      <span className={shown < text.length ? "opacity-70" : "opacity-0"}>▍</span>
    </span>
  );
}

/** Animates a number from 0 → value when mounted (key it to the phase). */
export function CountUp({
  value,
  decimals = 0,
  duration = 900,
  delay = 0,
  prefix = "",
  suffix = "",
  className,
  style,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let startTs = 0;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, duration, delay, reduced]);
  return (
    <span className={className} style={style}>
      {prefix}
      {(reduced ? value : display).toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ── SVG beams ──────────────────────────────────────────────────────────────
   Coordinates live in a 0–100 space stretched over the scene, with
   non-scaling strokes so lines stay hairline-thin at any size.            */

export function BeamLayer({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 z-[6] h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
    >
      {children}
    </svg>
  );
}

/**
 * A comet of light traveling along `d`. One-shot by default (remount via key
 * to replay); set `repeat` for ambient loops. `base` draws the faint rail.
 */
export function Beam({
  d,
  color,
  delay = 0,
  duration = 1.1,
  repeat = false,
  repeatDelay = 0,
  base = true,
  width = 1.6,
}: {
  d: string;
  color: string;
  delay?: number;
  duration?: number;
  repeat?: boolean;
  repeatDelay?: number;
  base?: boolean;
  width?: number;
}) {
  return (
    <>
      {base && (
        <path
          d={d}
          stroke={`${color}26`}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      )}
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        initial={{ pathLength: 0.16, pathOffset: 0, opacity: 0 }}
        animate={{ pathOffset: [0, 0.84], opacity: 1 }}
        transition={{
          pathOffset: {
            duration,
            delay,
            ease: "easeInOut",
            ...(repeat ? { repeat: Infinity, repeatDelay } : {}),
          },
          opacity: {
            duration,
            delay,
            times: [0, 0.15, 0.85, 1],
            ...(repeat ? { repeat: Infinity, repeatDelay } : {}),
          },
        }}
      />
    </>
  );
}

/** Static rail without a comet, for drawing the idle topology. */
export function Rail({ d, color }: { d: string; color: string }) {
  return (
    <path
      d={d}
      stroke={`${color}22`}
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
    />
  );
}

/* ── HUD chrome ───────────────────────────────────────────────────────── */

function CornerBrackets({ accent }: { accent: string }) {
  const corners = [
    "left-3 top-3 border-l border-t",
    "right-3 top-3 border-r border-t",
    "left-3 bottom-3 border-l border-b",
    "right-3 bottom-3 border-r border-b",
  ];
  return (
    <>
      {corners.map((c) => (
        <span
          key={c}
          aria-hidden
          className={`pointer-events-none absolute z-10 size-2.5 ${c}`}
          style={{ borderColor: `${accent}66` }}
        />
      ))}
    </>
  );
}

/** Blinking status dot */
export function LiveDot({ color, size = 6 }: { color: string; size?: number }) {
  return (
    <motion.span
      className="inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 10px ${color}`,
      }}
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/** Bottom-center step indicator narrating the loop (detail views). */
export function PhaseTracker({
  phases,
  current,
  accent,
}: {
  phases: string[];
  current: number;
  accent: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 hidden justify-center @3xl:flex">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/55 px-2 py-1.5 backdrop-blur-md">
        {phases.map((phase, index) => {
          const isActive = index === current;
          return (
            <span
              key={phase}
              className="rounded-full px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.18em] transition-colors duration-500"
              style={{
                color: isActive ? "#0a0a0c" : "rgba(255,255,255,0.38)",
                background: isActive ? accent : "transparent",
              }}
            >
              {phase}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Tiny mono label chip used across scenes. */
export function Chip({
  children,
  color,
  active = false,
  className = "",
  style,
}: {
  children: React.ReactNode;
  color: string;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 font-mono text-[7px] tracking-[0.14em] backdrop-blur-sm transition-colors duration-500 @3xl:px-2.5 @3xl:text-[8px] ${className}`}
      style={{
        borderColor: active ? `${color}88` : "rgba(255,255,255,0.1)",
        color: active ? color : "rgba(255,255,255,0.45)",
        background: active ? `${color}14` : "rgba(0,0,0,0.4)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ── Scene shell ──────────────────────────────────────────────────────── */

export function SceneShell({
  accent,
  name,
  status,
  children,
}: {
  accent: string;
  name: string;
  /** right-hand header readout, may change with the phase */
  status?: React.ReactNode;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.12 });
  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden bg-[#07090b] @container"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px),
          radial-gradient(85% 90% at 50% 42%, ${accent}1c 0%, transparent 60%)`,
        backgroundSize: "40px 40px, 40px 40px, 100% 100%",
      }}
    >
      <MotionConfig reducedMotion="user">
        {/* ambient drift */}
        <motion.div
          aria-hidden
          className="absolute -left-24 -top-24 size-72 rounded-full opacity-25 blur-3xl"
          style={{ background: accent }}
          animate={{ x: [0, 70, 15], y: [0, 35, 70], scale: [1, 1.15, 0.95] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-28 -right-20 size-80 rounded-full opacity-15 blur-3xl"
          style={{ background: accent }}
          animate={{ x: [0, -60, -10], y: [0, -40, 0], scale: [1, 0.9, 1.1] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* slow scan sweep */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-28"
          style={{
            background: `linear-gradient(180deg, transparent, ${accent}0a 45%, ${accent}12 50%, ${accent}0a 55%, transparent)`,
          }}
          animate={{ y: ["-120%", "520%"] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "linear",
          }}
        />

        <CornerBrackets accent={accent} />

        {/* header readouts */}
        <div className="absolute left-6 top-4 z-20 flex items-center gap-2">
          <LiveDot color={accent} size={5} />
          <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/55 @3xl:text-[9px]">
            {name}
          </span>
        </div>
        {status && (
          <div className="absolute right-6 top-4 z-20 hidden font-mono text-[8px] uppercase tracking-[0.18em] text-white/35 @xl:block @3xl:text-[9px]">
            {status}
          </div>
        )}

        <SceneActiveContext.Provider value={inView}>
          {children}
        </SceneActiveContext.Provider>

        {/* soft vignette to seat everything in the frame */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[8]"
          style={{
            background:
              "radial-gradient(120% 110% at 50% 50%, transparent 62%, rgba(0,0,0,0.42) 100%)",
          }}
        />
      </MotionConfig>
    </div>
  );
}
