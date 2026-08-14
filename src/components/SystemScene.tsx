"use client";

import { motion } from "framer-motion";

type SceneProps = {
  slug: string;
  accent: string;
  compact?: boolean;
};

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

function SceneShell({
  accent,
  compact,
  children,
}: SceneProps & { children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#07090b]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px), radial-gradient(circle at 50% 50%, " +
          accent +
          "20 0%, transparent 58%)",
        backgroundSize: compact ? "32px 32px, 32px 32px, 100% 100%" : "44px 44px, 44px 44px, 100% 100%",
      }}
    >
      <motion.div
        aria-hidden
        className="absolute -left-20 -top-20 size-64 rounded-full opacity-30 blur-3xl"
        style={{ background: accent }}
        animate={{ x: [0, 80, 20], y: [0, 30, 80], scale: [1, 1.2, 0.95] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-24 -right-16 size-72 rounded-full opacity-20 blur-3xl"
        style={{ background: accent }}
        animate={{ x: [0, -70, -10], y: [0, -45, 0], scale: [1, 0.85, 1.15] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      {children}
    </div>
  );
}

function Pulse({ accent, delay = 0 }: { accent: string; delay?: number }) {
  return (
    <motion.span
      className="absolute inset-0 rounded-full border"
      style={{ borderColor: accent }}
      animate={{ scale: [0.8, 2.2], opacity: [0.6, 0] }}
      transition={{ duration: 2.4, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

function LaunchScene({ accent, compact }: SceneProps) {
  const providers = ["CLAUDE", "GPT", "GEMINI", "GROK"];
  return (
    <SceneShell slug="launchpilot" accent={accent} compact={compact}>
      <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
        <div className="grid w-full max-w-4xl grid-cols-[0.8fr_1fr_0.9fr] items-center gap-4 sm:gap-8">
          <div className="space-y-2.5">
            {["RESEARCH", "STRATEGY", "CREATIVE"].map((label, index) => (
              <motion.div
                key={label}
                className="rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 font-mono text-[8px] tracking-[0.15em] text-zinc-400 backdrop-blur sm:text-[10px]"
                animate={{ x: [0, 5, 0], borderColor: ["rgba(255,255,255,.1)", accent + "55", "rgba(255,255,255,.1)"] }}
                transition={{ duration: 3.2, delay: index * 0.35, repeat: Infinity }}
              >
                {label}
              </motion.div>
            ))}
          </div>

          <div className="relative flex aspect-square items-center justify-center">
            <Pulse accent={accent} />
            <Pulse accent={accent} delay={1.2} />
            <motion.div
              className="relative z-10 flex size-24 flex-col items-center justify-center rounded-full border bg-black/70 text-center shadow-2xl backdrop-blur sm:size-36"
              style={{ borderColor: accent + "77", boxShadow: "0 0 60px " + accent + "24" }}
              animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.03, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <span className="font-mono text-[7px] tracking-[0.2em] text-zinc-500 sm:text-[9px]">CUSTOM</span>
              <span className="mt-1 text-[10px] font-semibold text-zinc-100 sm:text-sm">ORCHESTRATOR</span>
              <motion.span
                className="mt-2 size-1.5 rounded-full"
                style={{ background: accent }}
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {providers.map((provider, index) => (
              <motion.div
                key={provider}
                className="rounded-xl border bg-black/55 px-2 py-3 text-center font-mono text-[7px] tracking-wider text-zinc-300 backdrop-blur sm:text-[9px]"
                style={{ borderColor: accent + "35" }}
                animate={{ opacity: [0.45, 1, 0.45], y: [0, -3, 0] }}
                transition={{ duration: 2.8, delay: index * 0.4, repeat: Infinity }}
              >
                {provider}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {!compact && (
        <div className="absolute inset-x-8 bottom-8 flex justify-center gap-2">
          {["15 JOBS", "OAUTH", "POLICY GATES", "TELEMETRY"].map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-black/45 px-3 py-1.5 font-mono text-[8px] tracking-wider text-zinc-500">
              {item}
            </span>
          ))}
        </div>
      )}
    </SceneShell>
  );
}

function DeepLeadScene({ accent, compact }: SceneProps) {
  const dots = Array.from({ length: compact ? 12 : 18 });
  return (
    <SceneShell slug="deeplead" accent={accent} compact={compact}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative size-[260px] sm:size-[380px]">
          {dots.map((_, index) => {
            const angle = (index / dots.length) * Math.PI * 2;
            const radius = compact ? 105 : 155;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <motion.div
                key={index}
                className="absolute left-1/2 top-1/2 size-3 rounded-full border sm:size-4"
                style={{
                  marginLeft: -6,
                  marginTop: -6,
                  borderColor: accent + "77",
                  background: index % 3 === 0 ? accent : "#111318",
                  boxShadow: "0 0 18px " + accent + "44",
                }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ x, y, opacity: [0.35, 1, 0.35], scale: [0.8, 1.2, 0.8] }}
                transition={{ ...spring, delay: index * 0.05, opacity: { duration: 2.5, delay: index * 0.12, repeat: Infinity }, scale: { duration: 2.5, delay: index * 0.12, repeat: Infinity } }}
              />
            );
          })}
          <motion.div
            className="absolute left-1/2 top-1/2 flex size-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border bg-black/75 text-center backdrop-blur sm:size-40"
            style={{ borderColor: accent + "66", boxShadow: "0 0 80px " + accent + "2b" }}
            animate={{ scale: [1, 1.035, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="font-mono text-[8px] tracking-[0.2em] text-zinc-500">18 AGENTS</span>
            <span className="mt-1 text-xs font-semibold text-zinc-100 sm:text-base">EVIDENCE GRAPH</span>
            <span className="mt-2 font-mono text-[7px] text-zinc-500">ROUTE · CRITIQUE · SCORE</span>
          </motion.div>
        </div>
      </div>
      {!compact && (
        <motion.div
          className="absolute left-8 top-8 rounded-xl border bg-black/55 px-4 py-3 backdrop-blur"
          style={{ borderColor: accent + "35" }}
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <p className="font-mono text-[8px] tracking-wider text-zinc-500">SEMANTIC CRITIC</p>
          <p className="mt-1 text-xs text-zinc-200">claim confidence 0.94</p>
        </motion.div>
      )}
    </SceneShell>
  );
}

function PayControlScene({ accent, compact }: SceneProps) {
  const transactions = [
    ["COFFEE SHOP", "$6.40"],
    ["APP STORE", "$14.99"],
    ["ONLINE ORDER", "$82.10"],
  ];
  return (
    <SceneShell slug="paycontrol" accent={accent} compact={compact}>
      <div className="absolute inset-0 flex items-center justify-center p-7">
        <div className="grid w-full max-w-4xl grid-cols-[1fr_0.7fr_1fr] items-center gap-4 sm:gap-8">
          <div className="space-y-3">
            {transactions.map(([name, amount], index) => (
              <motion.div
                key={name}
                className="rounded-2xl border border-white/10 bg-black/50 p-3 backdrop-blur"
                animate={{ x: [0, 8, 0], opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 3.6, delay: index * 0.65, repeat: Infinity }}
              >
                <p className="font-mono text-[7px] tracking-wider text-zinc-500 sm:text-[9px]">{name}</p>
                <p className="mt-1 text-xs font-semibold text-zinc-100 sm:text-base">{amount}</p>
              </motion.div>
            ))}
          </div>

          <div className="relative flex h-44 items-center justify-center sm:h-56">
            <motion.div
              className="absolute h-full w-px"
              style={{ background: "linear-gradient(transparent, " + accent + ", transparent)" }}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="relative z-10 rounded-2xl border bg-black/80 px-3 py-5 text-center backdrop-blur sm:px-5"
              style={{ borderColor: accent + "66", boxShadow: "0 0 50px " + accent + "22" }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.8, repeat: Infinity }}
            >
              <p className="font-mono text-[7px] tracking-wider text-zinc-500">POLICY ENGINE</p>
              <p className="mt-2 text-[10px] font-semibold text-zinc-100 sm:text-xs">EVALUATING</p>
            </motion.div>
          </div>

          <div className="space-y-3">
            {[
              ["ALLOW", "#6EE7B7"],
              ["NOTIFY", "#7DB8E8"],
              ["REVIEW", accent],
            ].map(([label, color], index) => (
              <motion.div
                key={label}
                className="rounded-2xl border bg-black/50 px-3 py-4 text-center font-mono text-[8px] tracking-[0.16em] backdrop-blur sm:text-[10px]"
                style={{ borderColor: color + "55", color }}
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 3, delay: 0.5 + index * 0.7, repeat: Infinity }}
              >
                {label}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SceneShell>
  );
}

function VoiceScene({ accent, compact }: SceneProps) {
  const bars = Array.from({ length: compact ? 22 : 34 });
  return (
    <SceneShell slug="voicevault" accent={accent} compact={compact}>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
        <div className="flex h-24 items-center gap-1 sm:h-32 sm:gap-1.5">
          {bars.map((_, index) => (
            <motion.span
              key={index}
              className="w-1 rounded-full sm:w-1.5"
              style={{ background: accent, boxShadow: "0 0 12px " + accent + "55" }}
              animate={{ height: [8, 22 + ((index * 17) % 70), 12, 40 + ((index * 11) % 60), 8], opacity: [0.35, 1, 0.45, 0.9, 0.35] }}
              transition={{ duration: 2.2, delay: index * 0.045, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
        <motion.div
          className="mt-7 max-w-xl text-center"
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-zinc-500">live intent</p>
          <p className="mt-2 text-sm font-medium text-zinc-100 sm:text-xl">
            “Remind me to send the proposal after tomorrow&apos;s call.”
          </p>
        </motion.div>
        {!compact && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["REMINDER", "TOMORROW", "AFTER CALL", "CONFIDENCE 0.96"].map((token, index) => (
              <motion.span
                key={token}
                className="rounded-full border px-3 py-1.5 font-mono text-[8px] tracking-wider"
                style={{ borderColor: accent + "40", color: index === 3 ? accent : "#a1a1aa", background: accent + "0a" }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, delay: index * 0.25, repeat: Infinity }}
              >
                {token}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </SceneShell>
  );
}

function SupportScene({ accent, compact }: SceneProps) {
  const messages = [
    { label: "How do I restore my purchase?", score: "0.94", route: "AUTO REPLY", color: "#6EE7B7" },
    { label: "The app keeps crashing.", score: "0.42", route: "ESCALATE", color: "#FBBF24" },
    { label: "I need a refund.", score: "POLICY", route: "HUMAN REVIEW", color: "#FB7185" },
  ];
  return (
    <SceneShell slug="supportagent" accent={accent} compact={compact}>
      <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-4xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-500">support intelligence</p>
              <p className="mt-1 text-sm font-semibold text-zinc-100 sm:text-lg">Live routing queue</p>
            </div>
            <motion.span
              className="size-2 rounded-full"
              style={{ background: accent, boxShadow: "0 0 18px " + accent }}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </div>
          <div className="space-y-2.5">
            {messages.map((message, index) => (
              <motion.div
                key={message.label}
                className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-black/55 px-4 py-3 backdrop-blur sm:grid-cols-[1fr_90px_130px]"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: [0.45, 1, 0.65], x: 0 }}
                transition={{ duration: 3.4, delay: index * 0.65, repeat: Infinity, repeatType: "reverse" }}
              >
                <p className="truncate text-[10px] text-zinc-200 sm:text-sm">{message.label}</p>
                <p className="hidden text-center font-mono text-[9px] text-zinc-500 sm:block">{message.score}</p>
                <span
                  className="rounded-full border px-2.5 py-1 text-center font-mono text-[7px] tracking-wider sm:text-[8px]"
                  style={{ color: message.color, borderColor: message.color + "55", background: message.color + "0d" }}
                >
                  {message.route}
                </span>
              </motion.div>
            ))}
          </div>
          {!compact && (
            <div className="mt-5 grid grid-cols-3 gap-2 text-center font-mono text-[8px] tracking-wider text-zinc-500">
              <div className="rounded-xl border border-white/10 bg-black/40 py-2">KNOWLEDGE BASE</div>
              <div className="rounded-xl border border-white/10 bg-black/40 py-2">CLAUDE AGENT</div>
              <div className="rounded-xl border border-white/10 bg-black/40 py-2">MACOS OPERATOR</div>
            </div>
          )}
        </div>
      </div>
    </SceneShell>
  );
}

export default function SystemScene(props: SceneProps) {
  switch (props.slug) {
    case "launchpilot":
      return <LaunchScene {...props} />;
    case "deeplead":
      return <DeepLeadScene {...props} />;
    case "paycontrol":
      return <PayControlScene {...props} />;
    case "voicevault":
      return <VoiceScene {...props} />;
    case "supportagent":
      return <SupportScene {...props} />;
    default:
      return <SceneShell {...props}><div /></SceneShell>;
  }
}
