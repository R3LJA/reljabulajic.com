"use client";

import { motion } from "framer-motion";
import {
  Beam,
  BeamLayer,
  Chip,
  CountUp,
  PhaseTracker,
  SceneShell,
  TypeText,
  useSequence,
  type SceneProps,
} from "./primitives";

const TRIGGERS = ["REFUND", "LOW-CONF", "BUG?", "FRUSTRATION", "REPEAT", "ASK-HUMAN"];

type SupportCase = {
  msg: string;
  app: string;
  conf: number;
  sentiment: string;
  category: string;
  route: "auto" | "escalate" | "human";
  routeLabel: string;
  color: string;
  reply?: string;
  triggers: number[];
};

const CASES: SupportCase[] = [
  {
    msg: "How do I restore my purchase?",
    app: "AirPosture",
    conf: 0.94,
    sentiment: "neutral",
    category: "billing · faq",
    route: "auto",
    routeLabel: "AUTO REPLY",
    color: "#6EE7B7",
    reply: "Open Settings → Restore Purchases. Your plan syncs back in seconds.",
    triggers: [],
  },
  {
    msg: "The app keeps crashing since the update.",
    app: "Vael",
    conf: 0.42,
    sentiment: "concerned",
    category: "bug · unknown",
    route: "escalate",
    routeLabel: "ESCALATE",
    color: "#FBBF24",
    triggers: [1, 2],
  },
  {
    msg: "I want a refund right now.",
    app: "Recite",
    conf: 0.88,
    sentiment: "frustrated",
    category: "billing · refund",
    route: "human",
    routeLabel: "HUMAN REVIEW",
    color: "#FB7185",
    triggers: [0, 3],
  },
];

const DURATIONS = [5000, 5000, 5000] as const;
const PHASES = ["auto reply", "escalation", "policy hold"];
const MSG_Y = [32, 50, 68];

export default function SupportAgentScene({ accent, detail }: SceneProps) {
  const phase = useSequence(DURATIONS);
  const activeCase = CASES[phase];
  const toOperator = activeCase.route !== "auto";

  return (
    <SceneShell
      accent={accent}
      name="SupportAgent · Triage"
      status={`grounded · kb: ${activeCase.app.toLowerCase()}`}
    >
      {/* ── wide triage board ── */}
      <div className="absolute inset-0 hidden @3xl:block">
        <BeamLayer>
          <g key={phase}>
            <Beam
              d={`M 27 ${MSG_Y[phase]} C 30 ${MSG_Y[phase]}, 30 50, 33.5 50`}
              color={accent}
              delay={0.3}
              duration={0.7}
            />
            <Beam
              d={`M 62.5 50 C 65 50, 65 ${toOperator ? 66 : 33}, 68 ${toOperator ? 66 : 33}`}
              color={activeCase.color}
              delay={2.7}
              duration={0.7}
            />
          </g>
        </BeamLayer>

        {/* inbox */}
        <div className="absolute left-[4%] top-1/2 z-10 w-[23%] -translate-y-1/2">
          <p className="mb-2 font-mono text-[8px] tracking-[0.2em] text-zinc-500">
            INBOX · CHAT + EMAIL
          </p>
          <div className="space-y-2">
            {CASES.map((c, i) => {
              const isActive = i === phase;
              return (
                <motion.div
                  key={c.msg}
                  className="rounded-xl border bg-black/55 px-2.5 py-2 backdrop-blur-sm"
                  animate={{
                    borderColor: isActive ? `${accent}77` : "rgba(255,255,255,0.09)",
                    opacity: isActive ? 1 : 0.5,
                    x: isActive ? 3 : 0,
                    boxShadow: isActive ? `0 0 22px -8px ${accent}` : "0 0 0px rgba(0,0,0,0)",
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="truncate text-[9px] text-zinc-200">{c.msg}</p>
                  <p className="mt-1 font-mono text-[6.5px] tracking-[0.12em] text-zinc-500">
                    {c.app.toUpperCase()} · USER #{4821 + i}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* analysis core */}
        <div className="absolute left-[34%] top-1/2 z-10 w-[28%] -translate-y-1/2">
          <motion.div
            key={`analysis-${phase}`}
            className="rounded-2xl border bg-black/70 p-3 backdrop-blur"
            initial={{ borderColor: "rgba(255,255,255,0.1)" }}
            animate={{ borderColor: [`${accent}22`, `${accent}88`, `${accent}44`] }}
            transition={{ duration: 2.4, delay: 0.9 }}
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[7px] tracking-[0.18em] text-zinc-400">
                CLAUDE DECISION
              </p>
              <span className="font-mono text-[7px] text-zinc-500">{activeCase.category}</span>
            </div>

            {/* confidence vs threshold */}
            <div className="mt-2.5">
              <div className="flex items-baseline justify-between font-mono text-[7px] text-zinc-500">
                <span>confidence</span>
                <CountUp
                  key={`conf-${phase}`}
                  value={activeCase.conf}
                  decimals={2}
                  delay={1100}
                  duration={900}
                  style={{ color: activeCase.conf < 0.5 ? "#FBBF24" : "#6EE7B7" }}
                />
              </div>
              <div className="relative mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.span
                  key={`bar-${phase}`}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: activeCase.conf < 0.5 ? "#FBBF24" : "#6EE7B7" }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${activeCase.conf * 100}%` }}
                  transition={{ delay: 1.1, duration: 0.9, ease: "easeOut" }}
                />
                {/* escalation threshold */}
                <span className="absolute inset-y-0 left-1/2 w-px bg-white/50" />
              </div>
              <p className="mt-0.5 text-right font-mono text-[6px] text-zinc-600">
                ↑ 0.5 escalation threshold
              </p>
            </div>

            <div className="mt-1.5 flex items-center gap-1.5">
              <Chip color={accent} active>
                {activeCase.sentiment}
              </Chip>
              <motion.span
                key={`route-${phase}`}
                className="rounded-full border px-2 py-1 font-mono text-[7px] font-bold tracking-[0.14em]"
                style={{
                  borderColor: `${activeCase.color}88`,
                  color: activeCase.color,
                  background: `${activeCase.color}12`,
                }}
                initial={{ opacity: 0, scale: 1.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 17, delay: 2.5 }}
              >
                {activeCase.routeLabel}
              </motion.span>
            </div>

            {/* safety triggers */}
            <div className="mt-2 flex flex-wrap gap-1">
              {TRIGGERS.map((t, i) => {
                const fired = activeCase.triggers.includes(i);
                return (
                  <motion.span
                    key={`${t}-${phase}`}
                    className="rounded border px-1 py-0.5 font-mono text-[5.5px] tracking-[0.1em]"
                    initial={false}
                    animate={{
                      borderColor: fired ? `${activeCase.color}88` : "rgba(255,255,255,0.08)",
                      color: fired ? activeCase.color : "rgba(255,255,255,0.28)",
                      background: fired ? `${activeCase.color}14` : "transparent",
                    }}
                    transition={{ delay: fired ? 2.1 : 0, duration: 0.3 }}
                  >
                    {t}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* outcomes */}
        <div className="absolute right-[4%] top-1/2 z-10 flex w-[27%] -translate-y-1/2 flex-col gap-2.5">
          {/* auto reply */}
          <motion.div
            className="rounded-2xl border bg-black/60 p-2.5 backdrop-blur"
            animate={{
              borderColor: !toOperator ? "#6EE7B766" : "rgba(255,255,255,0.08)",
              opacity: !toOperator ? 1 : 0.55,
            }}
            transition={{ duration: 0.4, delay: !toOperator ? 3.2 : 0 }}
          >
            <p className="font-mono text-[7px] tracking-[0.18em] text-zinc-500">
              AUTO REPLY · GROUNDED
            </p>
            <div className="mt-1.5 min-h-9 rounded-lg rounded-tl-none border border-white/8 bg-white/[0.04] px-2 py-1.5">
              {!toOperator ? (
                <p className="text-[8px] leading-relaxed text-zinc-200">
                  <TypeText key={phase} text={activeCase.reply ?? ""} delay={3400} speed={14} />
                </p>
              ) : (
                <p className="font-mono text-[7px] text-zinc-600">standing by…</p>
              )}
            </div>
          </motion.div>

          {/* macOS operator queue */}
          <motion.div
            className="overflow-hidden rounded-xl border bg-[#141418]/90 backdrop-blur"
            animate={{
              borderColor: toOperator ? `${activeCase.color}55` : "rgba(255,255,255,0.1)",
              boxShadow: toOperator
                ? `0 0 30px -10px ${activeCase.color}`
                : "0 12px 30px rgba(0,0,0,0.4)",
            }}
            transition={{ duration: 0.5, delay: toOperator ? 3.2 : 0 }}
          >
            <div className="flex items-center gap-1.5 border-b border-white/8 bg-white/[0.04] px-2.5 py-1.5">
              <span className="size-1.5 rounded-full bg-[#ff5f57]" />
              <span className="size-1.5 rounded-full bg-[#febc2e]" />
              <span className="size-1.5 rounded-full bg-[#28c840]" />
              <span className="ml-1.5 font-mono text-[6.5px] tracking-[0.14em] text-zinc-400">
                OPERATOR · REVIEW QUEUE
              </span>
            </div>
            <div className="space-y-1 p-2">
              <div className="flex items-center justify-between rounded-md bg-white/[0.03] px-2 py-1">
                <span className="truncate text-[7.5px] text-zinc-400">Gut · payment dispute</span>
                <span className="font-mono text-[6px] text-zinc-600">2m</span>
              </div>
              {toOperator ? (
                <motion.div
                  key={`op-${phase}`}
                  className="flex items-center justify-between rounded-md border px-2 py-1"
                  style={{ borderColor: `${activeCase.color}55`, background: `${activeCase.color}0d` }}
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22, delay: 3.3 }}
                >
                  <span className="truncate text-[7.5px] text-zinc-100">
                    {activeCase.app} · {activeCase.msg}
                  </span>
                  <span
                    className="ml-1.5 shrink-0 font-mono text-[6px] font-bold"
                    style={{ color: activeCase.color }}
                  >
                    + CONTEXT
                  </span>
                </motion.div>
              ) : (
                <div className="flex items-center justify-between rounded-md bg-white/[0.03] px-2 py-1 opacity-60">
                  <span className="truncate text-[7.5px] text-zinc-500">Queue clear · agent handling</span>
                  <span className="font-mono text-[6px] text-zinc-600">·</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── compact queue for narrow cards ── */}
      <div className="absolute inset-x-[7%] top-1/2 z-10 -translate-y-1/2 @3xl:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-zinc-500">
              support intelligence
            </p>
            <p className="mt-0.5 text-sm font-semibold text-zinc-100">Live routing queue</p>
          </div>
          <motion.span
            className="size-1.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 14px ${accent}` }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </div>
        <div className="space-y-2">
          {CASES.map((c, i) => {
            const isActive = i === phase;
            return (
              <motion.div
                key={c.msg}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-2.5 rounded-xl border bg-black/55 px-3 py-2.5 backdrop-blur-sm"
                animate={{
                  borderColor: isActive ? `${accent}66` : "rgba(255,255,255,0.09)",
                  opacity: isActive ? 1 : 0.55,
                }}
                transition={{ duration: 0.4 }}
              >
                <p className="truncate text-[10px] text-zinc-200">{c.msg}</p>
                <span className="font-mono text-[8px] text-zinc-500">
                  {isActive ? (
                    <CountUp key={phase} value={c.conf} decimals={2} duration={900} delay={500} />
                  ) : (
                    c.conf.toFixed(2)
                  )}
                </span>
                <motion.span
                  key={`chip-${i}-${phase}`}
                  className="rounded-full border px-2 py-1 text-center font-mono text-[6.5px] font-bold tracking-[0.1em]"
                  style={{
                    color: c.color,
                    borderColor: `${c.color}55`,
                    background: `${c.color}0d`,
                  }}
                  initial={isActive ? { scale: 1.35, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 18, delay: isActive ? 1.6 : 0 }}
                >
                  {c.routeLabel}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {detail && (
        <>
          <div className="absolute bottom-4 left-6 z-20 hidden font-mono text-[9px] text-zinc-500 @3xl:block">
            <span style={{ color: accent }}>▸ </span>
            <TypeText
              key={phase}
              text={
                [
                  "case #4821 → auto-resolved · grounded in kb · conf 0.94",
                  "case #4822 → escalated · low confidence · full context attached",
                  "case #4823 → human review · refund policy · priority set",
                ][phase]
              }
              delay={3600}
              speed={16}
            />
          </div>
          <PhaseTracker phases={PHASES} current={phase} accent={accent} />
        </>
      )}
    </SceneShell>
  );
}
