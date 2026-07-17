"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * Scroll-drawn "signal thread" — a thin champagne trace that draws itself
 * down the home page as you scroll, winding between sections like a signal
 * traveling through a circuit: the "end to end" story at page scale. A
 * glowing pulse rides the tip and nodes light up as it passes. It sits above
 * the FlowField but behind content, so opaque cards occlude it and it peeks
 * through the gaps between them. Desktop only; reduced-motion users get the
 * complete path rendered statically.
 *
 * The route is authored in a normalized space (x 0–100 across the viewport,
 * y 0–1000 down the wrapped sections) and rescaled to the container's real
 * aspect on mount/resize, so the stroke stays uniform with no distortion.
 * The cubic chain is G1-continuous: each junction's controls mirror.
 */

const START = [50, 0] as const;
/* [c1x, c1y, c2x, c2y, x, y] — junctions double as node positions */
const SEGS = [
  [50, 30, 68, 45, 68, 85],
  [68, 130, 30, 150, 27, 210],
  [24, 265, 74, 290, 76, 355],
  [78, 420, 30, 445, 29, 520],
  [28, 590, 72, 615, 72, 690],
  [72, 760, 32, 785, 33, 850],
  [34, 905, 50, 915, 50, 960],
] as const;

const NODES = SEGS.map((s) => [s[4], s[5]] as const);

function buildPath(sy: number) {
  let d = `M ${START[0]} ${(START[1] * sy).toFixed(1)}`;
  for (const [c1x, c1y, c2x, c2y, x, y] of SEGS) {
    d += ` C ${c1x} ${(c1y * sy).toFixed(1)}, ${c2x} ${(c2y * sy).toFixed(
      1
    )}, ${x} ${(y * sy).toFixed(1)}`;
  }
  return d;
}

function Node({
  x,
  y,
  f,
  progress,
}: {
  x: number;
  y: number;
  f: number | null;
  progress: MotionValue<number>;
}) {
  /* until the path is measured, park the trigger range beyond progress=1 */
  const from = f == null ? 2 : Math.max(0, f - 0.035);
  const to = f == null ? 3 : Math.max(from + 0.001, f - 0.002);
  const lit = useTransform(progress, [from, to], [0, 1]);
  const pop = useTransform(progress, [from, to], [2.4, 1]);
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y / 10}%` }}
    >
      {/* unlit via pad */}
      <span
        className="relative block size-2.5 rounded-full border"
        style={{
          borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)",
          background: "var(--background)",
        }}
      />
      {/* lit state lands with a settle-in pop */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          opacity: lit,
          scale: pop,
          background: "var(--accent)",
          boxShadow:
            "0 0 14px 3px color-mix(in srgb, var(--accent) 45%, transparent)",
        }}
      />
    </div>
  );
}

export default function SignalThread() {
  const rootRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<SVGPathElement>(null);
  const totalLenRef = useRef(0);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [fractions, setFractions] = useState<number[] | null>(null);
  const reduced = useReducedMotion();

  /* tip rides just above the reading position as sections reveal */
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start 0.78", "end 0.85"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setDims((d) =>
          d && d.w === width && d.h === height ? d : { w: width, h: height }
        );
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = dims ? (dims.h / dims.w) * 100 : 0; // viewBox height, uniform scale
  const sy = H / 1000;
  const d = dims ? buildPath(sy) : "";
  const upx = dims ? 100 / dims.w : 0; // viewBox units per screen px

  /* arc-length fraction where the path crosses each node — the curve is
     monotonic in y, so a binary search per node is exact */
  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el || !d) return;
    const L = el.getTotalLength();
    totalLenRef.current = L;
    setFractions(
      NODES.map(([, yN]) => {
        const target = yN * sy;
        let lo = 0;
        let hi = L;
        for (let i = 0; i < 24; i++) {
          const mid = (lo + hi) / 2;
          if (el.getPointAtLength(mid).y < target) lo = mid;
          else hi = mid;
        }
        return lo / L;
      })
    );
  }, [d, sy]);

  /* the glowing pulse riding the tip of the drawn trace */
  const headLeft = useTransform(progress, (p) => {
    const el = measureRef.current;
    if (!el || !totalLenRef.current) return "50%";
    const pt = el.getPointAtLength(
      Math.min(1, Math.max(0, p)) * totalLenRef.current
    );
    return `${pt.x}%`;
  });
  const headTop = useTransform(progress, (p) => {
    const el = measureRef.current;
    if (!el || !totalLenRef.current || !H) return "0%";
    const pt = el.getPointAtLength(
      Math.min(1, Math.max(0, p)) * totalLenRef.current
    );
    return `${(pt.y / H) * 100}%`;
  });
  const headOpacity = useTransform(
    progress,
    [0, 0.012, 0.97, 0.995],
    [0, 1, 1, 0]
  );

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 -z-[5] hidden h-full w-screen -translate-x-1/2 lg:block"
    >
      {dims && (
        <>
          <svg
            className="h-full w-full"
            viewBox={`0 0 100 ${H}`}
            fill="none"
            preserveAspectRatio="none"
          >
            {/* faint ghost of the full route — the unlit trace ahead */}
            <path
              ref={measureRef}
              d={d}
              stroke="var(--accent)"
              strokeOpacity={0.1}
              strokeWidth={upx}
            />
            {reduced ? (
              <path
                d={d}
                stroke="var(--accent)"
                strokeOpacity={0.5}
                strokeWidth={1.6 * upx}
                strokeLinecap="round"
              />
            ) : (
              <>
                {/* soft glow under the crisp line */}
                <motion.path
                  d={d}
                  style={{ pathLength: progress }}
                  stroke="var(--accent)"
                  strokeOpacity={0.13}
                  strokeWidth={6 * upx}
                  strokeLinecap="round"
                />
                <motion.path
                  d={d}
                  style={{ pathLength: progress }}
                  stroke="var(--accent)"
                  strokeOpacity={0.6}
                  strokeWidth={1.6 * upx}
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>

          {NODES.map(([x, y], i) =>
            reduced ? (
              <span
                key={i}
                className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y / 10}%`,
                  background: "var(--accent)",
                }}
              />
            ) : (
              <Node
                key={i}
                x={x}
                y={y}
                f={fractions?.[i] ?? null}
                progress={progress}
              />
            )
          )}

          {!reduced && (
            <motion.div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: headLeft, top: headTop, opacity: headOpacity }}
            >
              <motion.span
                animate={{ scale: [1, 1.6, 1], opacity: [0.55, 0.2, 0.55] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow:
                    "0 0 22px 9px color-mix(in srgb, var(--accent) 50%, transparent)",
                }}
              />
              <span
                className="relative block size-2 rounded-full"
                style={{
                  background: "var(--accent)",
                  boxShadow:
                    "0 0 10px 2px color-mix(in srgb, var(--accent) 70%, transparent)",
                }}
              />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
