"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Chip,
  LiveDot,
  PhaseTracker,
  SceneShell,
  TypeText,
  useSceneActive,
  useSequence,
  type SceneProps,
} from "./primitives";

const RULES = ["DAILY LIMIT", "CATEGORY", "MERCHANT", "VELOCITY"];

const LANES = [
  { label: "ALLOW", color: "#6EE7B7", y: 28 },
  { label: "NOTIFY", color: "#7DB8E8", y: 50 },
  { label: "REVIEW", color: "#FBBF24", y: 72 },
];

type Txn = {
  merchant: string;
  amount: string;
  lane: number;
  /** verdict per rule chip: pass, warn or fail */
  rules: ("ok" | "warn" | "fail")[];
  stamp: string;
  note?: string;
  log: string;
};

const TXNS: Txn[] = [
  {
    merchant: "COFFEE CO",
    amount: "$6.40",
    lane: 0,
    rules: ["ok", "ok", "ok", "ok"],
    stamp: "ALLOW",
    log: "txn_8412 coffee co $6.40 · 4 rules passed · allowed ✓",
  },
  {
    merchant: "GAMEVERSE",
    amount: "$59.99",
    lane: 1,
    rules: ["ok", "warn", "ok", "ok"],
    stamp: "NOTIFY",
    note: "Push → parent device",
    log: "txn_8413 gameverse $59.99 · category rule fired · parent notified",
  },
  {
    merchant: "WIRE-X",
    amount: "$220.00",
    lane: 2,
    rules: ["fail", "ok", "fail", "ok"],
    stamp: "REVIEW",
    note: "Violation logged · limit",
    log: "txn_8414 wire-x $220.00 · 2 violations · held for review",
  },
];

const DURATIONS = [4600, 4600, 4600] as const;
const PHASES = ["allow path", "notify path", "review path"];
const BASE_COUNTS = [12, 4, 2];

const RULE_MARK = { ok: "✓", warn: "⚠", fail: "✗" } as const;
const RULE_COLOR = { ok: "#6EE7B7", warn: "#FBBF24", fail: "#FB7185" } as const;

export default function PayControlScene({ accent, detail }: SceneProps) {
  const phase = useSequence(DURATIONS);
  const reduced = useReducedMotion();
  const active = useSceneActive();
  const txn = TXNS[phase];
  const lane = LANES[txn.lane];

  /* lanes keep session totals while the loop runs */
  const [extra, setExtra] = useState([0, 0, 0]);
  useEffect(() => {
    if (reduced || !active) return;
    const id = setTimeout(() => {
      setExtra((c) => {
        const next = [...c];
        next[txn.lane] += 1;
        return next;
      });
    }, 3150);
    return () => clearTimeout(id);
  }, [phase, txn.lane, reduced, active]);

  return (
    <SceneShell
      accent={accent}
      name="PayControl · Policy engine"
      status="plaid sync · idempotent · sse live"
    >
      {/* webhook feed with decision history */}
      <div className="absolute z-10 hidden w-[20%] max-w-[168px] @3xl:block" style={{ left: "4%", top: "12%" }}>
        <div className="flex items-center gap-1.5">
          <LiveDot color={accent} size={5} />
          <span className="font-mono text-[8px] tracking-[0.16em] text-zinc-500">
            PLAID FEED · IDEMPOTENT
          </span>
        </div>
        <div className="mt-1.5 space-y-1.5">
          {[
            ["NETFLIX · $15.49", "allow", "#6EE7B7"],
            ["STEAM · $9.99", "notify", "#7DB8E8"],
          ].map(([txnLabel, verdict, color]) => (
            <div
              key={txnLabel}
              className="flex items-center justify-between rounded-lg border border-white/8 bg-black/45 px-2 py-1.5 font-mono text-[7px] tracking-[0.08em]"
            >
              <span className="text-zinc-500">{txnLabel}</span>
              <span style={{ color: `${color}aa` }}>{verdict}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute z-10 @3xl:hidden" style={{ left: "4%", top: "34%" }}>
        <div className="flex items-center gap-1.5">
          <LiveDot color={accent} size={5} />
          <span className="font-mono text-[6.5px] tracking-[0.16em] text-zinc-500">
            PLAID WEBHOOK
          </span>
        </div>
      </div>

      {/* inbound rail */}
      <div
        aria-hidden
        className="absolute z-[5] h-px"
        style={{
          left: "3%",
          right: "58%",
          top: "50%",
          background: `linear-gradient(90deg, transparent, ${accent}30)`,
        }}
      />

      {/* traveling transaction */}
      <motion.div
        key={phase}
        className="absolute z-30 w-[19%] max-w-[126px]"
        initial={{ left: "-8%", top: "44%", opacity: 0 }}
        animate={
          reduced
            ? { left: "22%", top: "44%", opacity: 1 }
            : {
                left: ["-8%", "22%", "22%", "63%", "63%", "63%"],
                top: ["44%", "44%", "44%", `${lane.y - 5}%`, `${lane.y - 5}%`, `${lane.y - 5}%`],
                opacity: [0, 1, 1, 1, 1, 0],
              }
        }
        transition={{
          duration: 4.3,
          times: [0, 0.15, 0.5, 0.67, 0.93, 1],
          ease: "easeInOut",
        }}
      >
        <div className="relative rounded-lg border border-white/12 bg-black/70 px-2 py-1.5 backdrop-blur @3xl:rounded-xl @3xl:px-3 @3xl:py-2">
          <p className="font-mono text-[6.5px] tracking-[0.14em] text-zinc-500 @3xl:text-[8px]">
            {txn.merchant}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-zinc-100 @3xl:text-sm">
            {txn.amount}
          </p>
          {/* decision stamp */}
          <motion.span
            className="absolute -right-2 -top-2.5 rounded border-2 px-1 py-px font-mono text-[7px] font-bold tracking-[0.14em] @3xl:-right-3 @3xl:px-1.5 @3xl:text-[9px]"
            style={{
              borderColor: lane.color,
              color: lane.color,
              background: "rgba(0,0,0,0.75)",
              rotate: "-8deg",
              boxShadow: `0 0 16px -4px ${lane.color}`,
            }}
            initial={{ opacity: 0, scale: 1.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 16,
              delay: reduced ? 0 : 2.05,
            }}
          >
            {txn.stamp}
          </motion.span>
        </div>
      </motion.div>

      {/* policy gate */}
      <div
        className="absolute z-20 w-[17%] max-w-[120px]"
        style={{ left: "42.5%", top: "50%", transform: "translateY(-50%)" }}
      >
        <motion.div
          key={`gate-${phase}`}
          className="rounded-xl border bg-black/70 p-1.5 backdrop-blur @3xl:rounded-2xl @3xl:p-2.5"
          initial={{ borderColor: "rgba(255,255,255,0.12)" }}
          animate={{
            borderColor: [
              "rgba(255,255,255,0.12)",
              `${accent}99`,
              `${accent}99`,
              "rgba(255,255,255,0.12)",
            ],
            boxShadow: [
              "0 0 0px rgba(0,0,0,0)",
              `0 0 34px -8px ${accent}`,
              `0 0 34px -8px ${accent}`,
              "0 0 0px rgba(0,0,0,0)",
            ],
          }}
          transition={{ duration: 4.3, times: [0, 0.2, 0.5, 0.62] }}
        >
          <p className="text-center font-mono text-[6px] tracking-[0.18em] text-zinc-400 @3xl:text-[8px]">
            POLICY ENGINE
          </p>
          <div className="mt-1 space-y-1 @3xl:mt-2 @3xl:space-y-1.5">
            {RULES.map((rule, i) => {
              const verdict = txn.rules[i];
              return (
                <motion.div
                  key={`${rule}-${phase}`}
                  className="flex items-center justify-between rounded-md border border-white/8 bg-white/[0.03] px-1.5 py-1 @3xl:px-2"
                  initial={{ opacity: 0.45 }}
                  animate={{ opacity: [0.45, 1, 1] }}
                  transition={{ duration: 0.5, delay: reduced ? 0 : 0.85 + i * 0.28 }}
                >
                  <span className="font-mono text-[5.5px] tracking-[0.12em] text-zinc-400 @3xl:text-[7px]">
                    {rule}
                  </span>
                  <motion.span
                    className="font-mono text-[7px] font-bold @3xl:text-[9px]"
                    style={{ color: RULE_COLOR[verdict] }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: reduced ? 0 : 1.05 + i * 0.28 }}
                  >
                    {RULE_MARK[verdict]}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* outcome lanes */}
      {LANES.map((l, i) => {
        const isHit = i === txn.lane;
        return (
          <div
            key={l.label}
            className="absolute z-10 w-[13%] max-w-[96px]"
            style={{ left: "84%", top: `${l.y}%`, transform: "translate(-50%,-50%)" }}
          >
            <motion.div
              key={`lane-${i}-${phase}`}
              className="rounded-lg border bg-black/55 px-2 py-1.5 text-center backdrop-blur-sm @3xl:rounded-xl @3xl:py-2"
              initial={{ borderColor: `${l.color}30` }}
              animate={
                isHit
                  ? {
                      borderColor: [`${l.color}30`, `${l.color}aa`, `${l.color}55`],
                      boxShadow: [
                        "0 0 0px rgba(0,0,0,0)",
                        `0 0 24px -6px ${l.color}`,
                        `0 0 12px -6px ${l.color}66`,
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1.4, delay: reduced ? 0 : 2.9 }}
            >
              <p
                className="font-mono text-[6.5px] tracking-[0.16em] @3xl:text-[8px]"
                style={{ color: l.color }}
              >
                {l.label}
              </p>
              <p className="mt-0.5 font-mono text-[9px] font-semibold text-zinc-100 @3xl:text-xs">
                {BASE_COUNTS[i] + extra[i]}
              </p>
            </motion.div>
          </div>
        );
      })}

      {/* side-effect toast, wide view only */}
      {txn.note && (
        <motion.div
          key={`note-${phase}`}
          className="absolute z-20 hidden @3xl:block"
          style={{ left: "84%", top: `${lane.y + 13}%`, transform: "translateX(-50%)" }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: [0, 1, 1, 0], y: 0 }}
          transition={{ duration: 1.9, delay: 3.15, times: [0, 0.2, 0.85, 1] }}
        >
          <Chip color={lane.color} active>
            {txn.note}
          </Chip>
        </motion.div>
      )}

      {detail && (
        <>
          <div className="absolute bottom-4 left-6 z-20 hidden font-mono text-[9px] text-zinc-500 @3xl:block">
            <span style={{ color: accent }}>▸ </span>
            <TypeText key={phase} text={txn.log} delay={3200} speed={16} />
          </div>
          <PhaseTracker phases={PHASES} current={phase} accent={accent} />
        </>
      )}
    </SceneShell>
  );
}
