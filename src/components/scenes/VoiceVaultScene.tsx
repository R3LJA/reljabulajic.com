"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Chip,
  CountUp,
  LiveDot,
  PhaseTracker,
  SceneShell,
  TypeText,
  useSequence,
  type SceneProps,
} from "./primitives";

/* two alternating utterances: an action flow and a memory-retrieval flow */
const UTTERANCES = [
  {
    quote: "Remind me to send the proposal after tomorrow's call.",
    repairs: "transcript repaired · 2 fixes",
    fields: [
      ["intent", "create_reminder"],
      ["when", "tomorrow · after call"],
      ["item", "send proposal"],
      ["context", "call w/ Sarah · 13:00"],
    ],
    conf: 0.96,
    result: { title: "Reminder scheduled", sub: "tomorrow · after the 13:00 call", memory: true },
  },
  {
    quote: "What did I decide about pricing last week?",
    repairs: "transcript repaired · 1 fix",
    fields: [
      ["intent", "memory_search"],
      ["scope", "decisions"],
      ["topic", "pricing"],
      ["range", "last 7 days"],
    ],
    conf: 0.93,
    result: { title: "Memory retrieved", sub: "Aug 12 · usage-based, $29 base", memory: false },
  },
] as const;

const DURATIONS = [2600, 3000, 3400, 3000, 2600, 3000, 3400, 3000] as const;
const PHASES = ["listen", "transcribe", "extract", "execute"];

const MEMORY_STACK = [
  { label: "decision · pricing", retrievable: true },
  { label: "note · standup recap", retrievable: false },
  { label: "task · renew domain", retrievable: false },
];

const BARS = Array.from({ length: 26 }, (_, i) => 12 + ((i * 37 + 11) % 44));

const RECENT_COMMANDS = [
  "→ create_task · gym 7am",
  "→ search_notes · budget",
  "→ summarize · this week",
];

export default function VoiceVaultScene({ accent, detail }: SceneProps) {
  const step = useSequence(DURATIONS);
  const dataset = Math.floor(step / 4);
  const phase = step % 4;
  const utterance = UTTERANCES[dataset];
  const capture = phase <= 1;

  const STATUS = [
    "capturing · 16kHz",
    "whisper + repair",
    "structured extraction",
    dataset === 1 ? "semantic retrieval" : "tool execution",
  ];

  return (
    <SceneShell accent={accent} name="VoiceVault · Voice pipeline" status={STATUS[phase]}>
      {/* pipeline rail; the wide detail hero narrates via the tracker instead */}
      <div
        className={`absolute left-1/2 top-[13%] z-10 flex -translate-x-1/2 gap-1.5 ${detail ? "@3xl:hidden" : ""}`}
      >
        {PHASES.map((p, i) => (
          <Chip key={p} color={accent} active={i === phase}>
            {p.toUpperCase()}
          </Chip>
        ))}
      </div>
      <div className="absolute left-[5%] top-1/2 z-10 hidden w-[17%] max-w-[160px] -translate-y-1/2 @3xl:block">
        <p className="mb-1.5 font-mono text-[7px] tracking-[0.2em] text-zinc-500">
          RECENT COMMANDS
        </p>
        <div className="space-y-1.5">
          {RECENT_COMMANDS.map((c) => (
            <div
              key={c}
              className="rounded-lg border border-white/10 bg-black/45 px-2 py-1.5 font-mono text-[7px] tracking-[0.08em] text-zinc-500"
            >
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* memory stack */}
      <div className="absolute right-[5%] top-1/2 z-10 hidden w-[17%] max-w-[150px] -translate-y-1/2 @3xl:block">
        <p className="mb-1.5 font-mono text-[7px] tracking-[0.2em] text-zinc-500">
          SEARCHABLE MEMORY
        </p>
        <div className="space-y-1.5">
          {phase === 3 && utterance.result.memory && (
            <motion.div
              initial={{ opacity: 0, x: -26, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 20, delay: 1.1 }}
              className="rounded-lg border px-2 py-1.5 font-mono text-[7px] tracking-[0.1em]"
              style={{
                borderColor: `${accent}88`,
                color: accent,
                background: `${accent}12`,
                boxShadow: `0 0 18px -6px ${accent}`,
              }}
            >
              reminder · proposal
            </motion.div>
          )}
          {MEMORY_STACK.map((m) => {
            const retrieved =
              phase === 3 && dataset === 1 && m.retrievable;
            return (
              <motion.div
                key={m.label}
                className="rounded-lg border px-2 py-1.5 font-mono text-[7px] tracking-[0.1em]"
                animate={{
                  borderColor: retrieved ? `${accent}99` : "rgba(255,255,255,0.1)",
                  color: retrieved ? accent : "rgba(255,255,255,0.4)",
                  boxShadow: retrieved ? `0 0 18px -6px ${accent}` : "0 0 0px rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.5, delay: retrieved ? 0.9 : 0 }}
              >
                {m.label}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-[8%] top-1/2 z-10 -translate-y-1/2 @3xl:inset-x-[24%]">
        <AnimatePresence mode="wait">
          {capture ? (
            <motion.div
              key={`capture-${dataset}`}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {/* waveform that collapses once transcription starts */}
              <motion.div
                className="flex h-16 items-center gap-[3px] @3xl:h-24 @3xl:gap-1"
                animate={{ scaleY: phase === 0 ? 1 : 0.16, opacity: phase === 0 ? 1 : 0.45 }}
                transition={{ duration: 0.7, ease: [0.3, 0.8, 0.3, 1] }}
              >
                {BARS.map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-[3px] rounded-full @3xl:w-1"
                    style={{ background: accent, boxShadow: `0 0 10px ${accent}55` }}
                    animate={
                      phase === 0
                        ? { height: [h * 0.3, h, h * 0.45, h * 0.85, h * 0.3] }
                        : { height: 4 }
                    }
                    transition={
                      phase === 0
                        ? { duration: 1.5, delay: i * 0.05, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.5 }
                    }
                  />
                ))}
              </motion.div>

              <div className="mt-4 flex min-h-14 flex-col items-center @3xl:mt-5 @3xl:min-h-16">
                {phase === 0 ? (
                  <Chip color={accent} active>
                    <LiveDot color={accent} size={4} /> LIVE CAPTURE
                  </Chip>
                ) : (
                  <>
                    <p className="max-w-md text-center text-[11px] font-medium leading-snug text-zinc-100 @3xl:text-lg">
                      <TypeText text={`“${utterance.quote}”`} speed={20} delay={250} />
                    </p>
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.9, duration: 0.4 }}
                      className="mt-2.5"
                    >
                      <Chip color={accent}>{utterance.repairs}</Chip>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          ) : phase === 2 ? (
            <motion.div
              key={`extract-${dataset}`}
              className="mx-auto w-full max-w-[300px] @3xl:max-w-[360px]"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="rounded-xl border bg-black/70 p-3 backdrop-blur @3xl:rounded-2xl @3xl:p-4"
                style={{ borderColor: `${accent}45`, boxShadow: `0 0 40px -12px ${accent}` }}
              >
                <p className="font-mono text-[7px] tracking-[0.2em] text-zinc-500 @3xl:text-[8px]">
                  STRUCTURED INTENT
                </p>
                <div className="mt-2 space-y-1.5 @3xl:mt-2.5">
                  {utterance.fields.map(([k, v], i) => (
                    <motion.div
                      key={k}
                      className="flex items-baseline justify-between gap-3 border-b border-white/5 pb-1"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.35, duration: 0.35 }}
                    >
                      <span className="font-mono text-[7px] tracking-[0.12em] text-zinc-500 @3xl:text-[8px]">
                        {k}
                      </span>
                      <span
                        className="font-mono text-[8px] @3xl:text-[10px]"
                        style={{ color: i === 0 ? accent : "#e4e4e7" }}
                      >
                        {v}
                      </span>
                    </motion.div>
                  ))}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-mono text-[7px] tracking-[0.12em] text-zinc-500 @3xl:text-[8px]">
                      confidence
                    </span>
                    <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                      <motion.span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ background: accent }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${utterance.conf * 100}%` }}
                        transition={{ delay: 1.7, duration: 0.8, ease: "easeOut" }}
                      />
                    </span>
                    <CountUp
                      value={utterance.conf}
                      decimals={2}
                      delay={1700}
                      duration={800}
                      className="font-mono text-[8px] @3xl:text-[9px]"
                      style={{ color: accent }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`execute-${dataset}`}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="flex items-center gap-3 rounded-xl border bg-black/70 px-3.5 py-2.5 backdrop-blur @3xl:rounded-2xl @3xl:px-5 @3xl:py-3.5"
                style={{ borderColor: `${accent}55`, boxShadow: `0 0 44px -10px ${accent}` }}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
              >
                <motion.span
                  className="flex size-6 items-center justify-center rounded-full border text-[10px] font-bold @3xl:size-8 @3xl:text-sm"
                  style={{ borderColor: `${accent}77`, color: accent, background: `${accent}14` }}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}
                >
                  ✓
                </motion.span>
                <div>
                  <p className="text-[11px] font-semibold text-zinc-50 @3xl:text-sm">
                    {utterance.result.title}
                  </p>
                  <p className="mt-0.5 font-mono text-[7px] tracking-[0.1em] text-zinc-400 @3xl:text-[9px]">
                    {utterance.result.sub}
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-3"
              >
                <Chip color={accent}>
                  {utterance.result.memory ? "SAVED TO MEMORY · UNDO AVAILABLE" : "GROUNDED IN YOUR OWN NOTES"}
                </Chip>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {detail && <PhaseTracker phases={PHASES} current={phase} accent={accent} />}
    </SceneShell>
  );
}
