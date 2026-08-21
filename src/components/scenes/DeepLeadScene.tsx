"use client";

import { motion } from "framer-motion";
import {
  Beam,
  BeamLayer,
  Chip,
  CountUp,
  PhaseTracker,
  Rail,
  SceneShell,
  useSequence,
  type SceneProps,
} from "./primitives";

const SOURCES = [
  { label: "WEB", x: 14, y: 30 },
  { label: "GITHUB", x: 31, y: 13 },
  { label: "LINKEDIN", x: 69, y: 13 },
  { label: "NEWS", x: 87, y: 32 },
  { label: "REGISTRY", x: 84, y: 66 },
  { label: "FORUMS", x: 16, y: 64 },
];

/* claims triangulated from sources; the last one dies in the critic pass */
const CLAIMS = [
  { text: "Series B · $24M", conf: 0.96, x: 67, y: 41, ok: true },
  { text: "Hiring 12 SDRs", conf: 0.91, x: 61, y: 25, ok: true },
  { text: "K8s migration", conf: 0.88, x: 35, y: 27, ok: true },
  { text: "Rev. est. $40M", conf: 0.41, x: 32, y: 56, ok: false },
];

const DURATIONS = [3000, 3400, 3000, 3600] as const;
const PHASES = ["scan", "claims", "critique", "score"];
const STATUS = [
  "scanning 6 sources",
  "extracting claims",
  "semantic critic pass",
  "fit scoring · tier a",
];

function edge(s: { x: number; y: number }, bend: number) {
  const mx = (s.x + 50) / 2;
  const my = (s.y + 50) / 2;
  return `M ${s.x} ${s.y} Q ${mx + bend} ${my - bend}, 50 50`;
}

export default function DeepLeadScene({ accent, detail }: SceneProps) {
  const phase = useSequence(DURATIONS);
  const judged = phase >= 2;
  const scored = phase === 3;

  return (
    <SceneShell accent={accent} name="DeepLead · Agent graph" status={STATUS[phase]}>
      <BeamLayer>
        {SOURCES.map((s, i) => {
          const d = edge(s, i % 2 === 0 ? 6 : -6);
          return phase === 0 ? (
            <motion.path
              key={`${s.label}-draw`}
              d={d}
              stroke={`${accent}30`}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.28 }}
            />
          ) : (
            <Rail key={s.label} d={d} color={accent} />
          );
        })}
        {/* evidence flowing inward */}
        {SOURCES.map((s, i) => (
          <Beam
            key={`pulse-${s.label}`}
            d={edge(s, i % 2 === 0 ? 6 : -6)}
            color={accent}
            base={false}
            width={1.3}
            delay={1 + i * 0.55}
            duration={1.15}
            repeat
            repeatDelay={2.4}
          />
        ))}
      </BeamLayer>

      {/* source nodes */}
      {SOURCES.map((s, i) => (
        <motion.div
          key={s.label}
          className="absolute z-10"
          style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%,-50%)" }}
          initial={false}
          animate={{ opacity: phase === 0 ? [0, 1] : 1 }}
          transition={{ duration: 0.5, delay: phase === 0 ? 0.2 + i * 0.28 : 0 }}
        >
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/55 px-2 py-1 backdrop-blur-sm @3xl:px-2.5 @3xl:py-1.5">
            <span
              className="size-1 rounded-full @3xl:size-1.5"
              style={{ background: `${accent}bb`, boxShadow: `0 0 8px ${accent}88` }}
            />
            <span className="font-mono text-[6.5px] tracking-[0.14em] text-zinc-400 @3xl:text-[8px]">
              {s.label}
            </span>
          </div>
        </motion.div>
      ))}

      {/* target core with orbiting agents */}
      <div
        className="absolute z-10"
        style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}
      >
        <div className="relative flex size-[108px] items-center justify-center @3xl:size-[150px]">
          {[
            { inset: "-14%", duration: 12, delay: 0 },
            { inset: "-2%", duration: 18, delay: 0.4 },
          ].map((orbit, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute rounded-full"
              style={{ inset: orbit.inset }}
              animate={{ rotate: 360 }}
              transition={{ duration: orbit.duration, repeat: Infinity, ease: "linear" }}
            >
              <span
                className="absolute left-1/2 top-0 size-1 -translate-x-1/2 rounded-full @3xl:size-1.5"
                style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
              />
            </motion.span>
          ))}
          {/* critic sweep */}
          {phase === 2 &&
            [0, 0.7].map((delay) => (
              <motion.span
                key={delay}
                aria-hidden
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: accent }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 3.4], opacity: [0.5, 0] }}
                transition={{ duration: 1.6, delay, ease: "easeOut" }}
              />
            ))}
          <div
            className="relative z-10 flex size-[82%] flex-col items-center justify-center rounded-full border bg-black/75 text-center backdrop-blur"
            style={{ borderColor: `${accent}66`, boxShadow: `0 0 70px ${accent}28` }}
          >
            <span className="font-mono text-[6px] tracking-[0.2em] text-zinc-500 @3xl:text-[8px]">
              TARGET
            </span>
            <span className="mt-0.5 text-[9px] font-semibold text-zinc-100 @3xl:text-sm">
              Atlas Robotics
            </span>
            <span className="mt-1 font-mono text-[5.5px] tracking-[0.14em] text-zinc-500 @3xl:text-[7px]">
              18 AGENTS · ROUTE · CRITIQUE
            </span>
          </div>
        </div>
      </div>

      {/* claims */}
      {phase >= 1 &&
        CLAIMS.map((c, i) => {
          const rejected = judged && !c.ok;
          const verified = judged && c.ok;
          return (
            <motion.div
              key={c.text}
              className="absolute z-20"
              style={{ left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%,-50%)" }}
              initial={phase === 1 ? { opacity: 0, scale: 0.8, y: 6 } : false}
              animate={{ opacity: rejected ? 0.38 : 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 210,
                damping: 20,
                delay: phase === 1 ? 0.3 + i * 0.5 : phase === 2 ? 0.9 + i * 0.18 : 0,
              }}
            >
              <div
                className="rounded-lg border bg-black/65 px-2 py-1 backdrop-blur-sm transition-colors duration-500 @3xl:rounded-xl @3xl:px-2.5 @3xl:py-1.5"
                style={{
                  borderColor: verified
                    ? `${accent}77`
                    : rejected
                      ? "rgba(251,113,133,0.5)"
                      : "rgba(255,255,255,0.12)",
                  boxShadow: verified ? `0 0 18px -6px ${accent}` : undefined,
                  transitionDelay: judged ? `${0.55 + i * 0.15}s` : "0s",
                }}
              >
                <p
                  className={`text-[8px] font-medium text-zinc-100 @3xl:text-[10px] ${rejected ? "line-through" : ""}`}
                >
                  {c.text}
                </p>
                <p className="mt-0.5 flex items-center gap-1 font-mono text-[6px] @3xl:text-[7px]">
                  <span className="text-zinc-500">conf</span>
                  <CountUp
                    value={c.conf}
                    decimals={2}
                    duration={800}
                    delay={phase === 1 ? 400 + i * 500 : 0}
                    style={{ color: rejected ? "#FB7185" : accent }}
                  />
                  {verified && (
                    <motion.span
                      style={{ color: accent }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.15 }}
                    >
                      ✓
                    </motion.span>
                  )}
                  {rejected && (
                    <motion.span
                      className="text-[#FB7185]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.15 }}
                    >
                      ✗ critic
                    </motion.span>
                  )}
                </p>
              </div>
            </motion.div>
          );
        })}

      {/* fit score */}
      {scored && (
        <motion.div
          className="absolute left-1/2 z-20 -translate-x-1/2"
          style={{ top: "74%" }}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 190, damping: 18, delay: 0.25 }}
        >
          <div
            className="flex items-center gap-2.5 rounded-full border bg-black/70 py-1.5 pl-1.5 pr-3 backdrop-blur @3xl:gap-3 @3xl:pr-4"
            style={{ borderColor: `${accent}55`, boxShadow: `0 0 34px -8px ${accent}` }}
          >
            <span className="relative flex size-7 items-center justify-center @3xl:size-9">
              <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                <circle cx="18" cy="18" r="15.5" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" fill="none" />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  stroke={accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 0.87 }}
                  transition={{ duration: 1.1, delay: 0.4, ease: "easeOut" }}
                />
              </svg>
              <CountUp
                value={87}
                duration={1100}
                delay={400}
                className="font-mono text-[8px] font-semibold text-zinc-50 @3xl:text-[10px]"
              />
            </span>
            <div className="leading-tight">
              <p className="font-mono text-[6.5px] tracking-[0.18em] text-zinc-500 @3xl:text-[8px]">
                FIT SCORE
              </p>
              <p className="text-[9px] font-semibold @3xl:text-[11px]" style={{ color: accent }}>
                TIER A · ACTIVATE
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* agent-pipeline chips on cards; the detail hero gets the tracker instead */}
      {!detail && (
        <div className="absolute bottom-[11%] left-1/2 z-10 hidden -translate-x-1/2 gap-2 @3xl:flex">
          {["RESEARCH", "ENRICH", "CRITIQUE", "SCORE"].map((c, i) => (
            <Chip key={c} color={accent} active={i === phase}>
              {c}
            </Chip>
          ))}
        </div>
      )}

      {detail && <PhaseTracker phases={PHASES} current={phase} accent={accent} />}
    </SceneShell>
  );
}
