"use client";

import { motion } from "framer-motion";
import {
  Beam,
  BeamLayer,
  Chip,
  PhaseTracker,
  Rail,
  SceneShell,
  TypeText,
  useSequence,
  type SceneProps,
} from "./primitives";

/* one routed job per phase; the third one exercises the fallback path */
type RouteEvent = {
  task: number;
  provider: number;
  /** provider that times out before rerouting */
  fallbackFrom?: number;
  latency: string;
  log: string;
  hold: number;
};

const TASKS = [
  { label: "RESEARCH", y: 26 },
  { label: "STRATEGY", y: 42 },
  { label: "CREATIVE", y: 58 },
  { label: "PUBLISH", y: 74 },
];

const PROVIDERS = [
  { label: "CLAUDE", x: 73, y: 34 },
  { label: "GPT", x: 88, y: 34 },
  { label: "GEMINI", x: 73, y: 62 },
  { label: "GROK", x: 88, y: 62 },
];

const EVENTS: RouteEvent[] = [
  {
    task: 0,
    provider: 0,
    latency: "412ms",
    log: "route research → claude · 412ms · grounded ✓",
    hold: 3600,
  },
  {
    task: 2,
    provider: 1,
    latency: "388ms",
    log: "route creative → gpt · 388ms · brand voice ✓",
    hold: 3600,
  },
  {
    task: 1,
    provider: 1,
    fallbackFrom: 2,
    latency: "1.9s",
    log: "gemini timeout → fallback gpt · job recovered ✓",
    hold: 5000,
  },
  {
    task: 3,
    provider: 3,
    latency: "queued",
    log: "publish job #14 scheduled · state persisted ✓",
    hold: 3600,
  },
];

const DURATIONS = EVENTS.map((e) => e.hold);
const PHASES = ["research", "creative", "recovery", "publish"];

const CORE = { x: 47, y: 50 };

function taskBeam(y: number) {
  return `M 29 ${y} C 37 ${y}, 38 ${CORE.y}, ${CORE.x - 3} ${CORE.y}`;
}
function providerBeam(p: { x: number; y: number }) {
  return `M ${CORE.x + 3} ${CORE.y} C 58 ${CORE.y}, 58 ${p.y}, ${p.x - 6.5} ${p.y}`;
}

export default function LaunchPilotScene({ accent, detail }: SceneProps) {
  const phase = useSequence(DURATIONS);
  const event = EVENTS[phase];
  const hasFallback = event.fallbackFrom !== undefined;
  /* moment the final provider lights up, in seconds into the phase */
  const settle = hasFallback ? 3.1 : 1.9;

  return (
    <SceneShell
      accent={accent}
      name="LaunchPilot · Orchestrator"
      status="15 jobs · 4 providers · fallbacks armed"
    >
      {/* rails: full idle topology */}
      <BeamLayer>
        {TASKS.map((t) => (
          <Rail key={t.label} d={taskBeam(t.y)} color={accent} />
        ))}
        {PROVIDERS.map((p) => (
          <Rail key={p.label} d={providerBeam(p)} color={accent} />
        ))}
        {/* the live event, keyed so it replays every phase */}
        <g key={phase}>
          <Beam
            d={taskBeam(TASKS[event.task].y)}
            color={accent}
            delay={0.15}
            duration={0.9}
            base={false}
          />
          {hasFallback ? (
            <>
              <Beam
                d={providerBeam(PROVIDERS[event.fallbackFrom!])}
                color="#FBBF24"
                delay={1.1}
                duration={0.85}
                base={false}
              />
              <Beam
                d={providerBeam(PROVIDERS[event.provider])}
                color={accent}
                delay={2.3}
                duration={0.85}
                base={false}
              />
            </>
          ) : (
            <Beam
              d={providerBeam(PROVIDERS[event.provider])}
              color={accent}
              delay={1.1}
              duration={0.85}
              base={false}
            />
          )}
        </g>
      </BeamLayer>

      {/* task queue */}
      {TASKS.map((t, i) => {
        const isActive = i === event.task;
        return (
          <div
            key={t.label}
            className="absolute z-10 w-[23%] max-w-[150px]"
            style={{ left: "4%", top: `${t.y}%`, transform: "translateY(-50%)" }}
          >
            <motion.div
              className="rounded-lg border bg-black/55 px-2 py-1.5 backdrop-blur-sm @3xl:rounded-xl @3xl:px-3 @3xl:py-2.5"
              animate={{
                borderColor: isActive ? `${accent}88` : "rgba(255,255,255,0.09)",
                boxShadow: isActive
                  ? `0 0 24px -6px ${accent}aa`
                  : "0 0 0px rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between gap-1">
                <span
                  className="font-mono text-[7px] tracking-[0.16em] transition-colors duration-300 @3xl:text-[9px]"
                  style={{ color: isActive ? "#fafafa" : "rgba(255,255,255,0.42)" }}
                >
                  {t.label}
                </span>
                <motion.span
                  className="size-1 rounded-full @3xl:size-1.5"
                  animate={{
                    background: isActive ? accent : "rgba(255,255,255,0.18)",
                    opacity: isActive ? [0.4, 1, 0.4] : 0.5,
                  }}
                  transition={{
                    opacity: { duration: 0.9, repeat: isActive ? Infinity : 0 },
                  }}
                />
              </div>
            </motion.div>
          </div>
        );
      })}

      {/* orchestrator core */}
      <div
        className="absolute z-10"
        style={{ left: `${CORE.x}%`, top: "50%", transform: "translate(-50%,-50%)" }}
      >
        <div className="relative flex size-[104px] items-center justify-center @3xl:size-[150px]">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-dashed"
            style={{ borderColor: `${accent}45` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          />
          <motion.span
            aria-hidden
            className="absolute inset-[9px] rounded-full border border-dotted @3xl:inset-[13px]"
            style={{ borderColor: `${accent}30` }}
            animate={{ rotate: -360 }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          />
          {/* impact pulse when a job hits the core */}
          <motion.span
            key={phase}
            aria-hidden
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: accent }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.6], opacity: [0.55, 0] }}
            transition={{ duration: 1, delay: 0.95, ease: "easeOut" }}
          />
          <div
            className="relative z-10 flex size-[72%] flex-col items-center justify-center rounded-full border bg-black/75 text-center backdrop-blur"
            style={{
              borderColor: `${accent}70`,
              boxShadow: `0 0 55px ${accent}26`,
            }}
          >
            <span className="font-mono text-[6px] tracking-[0.22em] text-zinc-500 @3xl:text-[8px]">
              CUSTOM
            </span>
            <span className="mt-0.5 text-[9px] font-semibold text-zinc-100 @3xl:text-xs">
              ORCHESTRATOR
            </span>
            <motion.span
              className="mt-1.5 size-1 rounded-full @3xl:size-1.5"
              style={{ background: accent }}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          </div>
        </div>
      </div>

      {/* provider fleet */}
      {PROVIDERS.map((p, i) => {
        const isTarget = i === event.provider;
        const isTimeout = hasFallback && i === event.fallbackFrom;
        return (
          <div
            key={p.label}
            className="absolute z-10 w-[12.5%] max-w-[86px]"
            style={{
              left: `${p.x - 6.25}%`,
              top: `${p.y}%`,
              transform: "translateY(-50%)",
            }}
          >
            <motion.div
              key={`${p.label}-${phase}`}
              className="flex flex-col items-center rounded-lg border bg-black/55 px-1 py-1.5 text-center backdrop-blur-sm @3xl:rounded-xl @3xl:py-2.5"
              initial={{
                borderColor: "rgba(255,255,255,0.09)",
                boxShadow: "0 0 0px rgba(0,0,0,0)",
              }}
              animate={
                isTimeout
                  ? {
                      borderColor: [
                        "rgba(255,255,255,0.09)",
                        "#FBBF24aa",
                        "rgba(255,255,255,0.09)",
                      ],
                      boxShadow: [
                        "0 0 0px rgba(0,0,0,0)",
                        "0 0 22px -6px #FBBF24",
                        "0 0 0px rgba(0,0,0,0)",
                      ],
                    }
                  : isTarget
                    ? {
                        borderColor: `${accent}88`,
                        boxShadow: `0 0 22px -5px ${accent}`,
                      }
                    : {}
              }
              transition={
                isTimeout
                  ? { duration: 1.1, delay: 1.9, times: [0, 0.25, 1] }
                  : { duration: 0.4, delay: settle }
              }
            >
              <span className="font-mono text-[7px] tracking-[0.14em] text-zinc-300 @3xl:text-[9px]">
                {p.label}
              </span>
              <span className="mt-0.5 block h-[10px] @3xl:h-[12px]">
                {isTimeout && (
                  <motion.span
                    className="font-mono text-[6px] tracking-[0.12em] text-[#FBBF24] @3xl:text-[7px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.6] }}
                    transition={{ duration: 0.9, delay: 1.95 }}
                  >
                    TIMEOUT
                  </motion.span>
                )}
                {isTarget && (
                  <motion.span
                    className="font-mono text-[6px] tracking-[0.12em] @3xl:text-[7px]"
                    style={{ color: accent }}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: settle + 0.1 }}
                  >
                    {event.latency} ✓
                  </motion.span>
                )}
              </span>
            </motion.div>
          </div>
        );
      })}

      {/* control-plane chips, wide view only */}
      <div className="absolute bottom-[11%] left-1/2 z-10 hidden -translate-x-1/2 gap-2 @3xl:flex">
        {["POLICY GATES", "OAUTH", "TELEMETRY", "RETRY STATE"].map((c, i) => (
          <Chip key={c} color={accent} active={detail && i === phase % 4}>
            {c}
          </Chip>
        ))}
      </div>

      {detail && (
        <>
          <div className="absolute bottom-4 left-6 z-20 hidden font-mono text-[9px] text-zinc-500 @3xl:block">
            <span style={{ color: accent }}>▸ </span>
            <TypeText key={phase} text={event.log} delay={2200} speed={18} />
          </div>
          <PhaseTracker phases={PHASES} current={phase} accent={accent} />
        </>
      )}
    </SceneShell>
  );
}
