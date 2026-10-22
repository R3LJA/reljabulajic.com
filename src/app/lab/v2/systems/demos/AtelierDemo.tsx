"use client";

import { motion } from "framer-motion";
import { BAD, Bar, Card, Check, EASE, GOLD, Label, Live, Mono, OK, Pill, Scene, Stagger, Typed, type DemoProps } from "./kit";

// MOCKUP ONLY: invented project, plan, team, costs and incident for the Atelier case study.

const PRIORITY: Record<string, string> = { Urgent: BAD, High: GOLD, Medium: "#8FB8E8", Low: "#ffffff66" };

const PLAN = [
  { id: "PAY-1", t: "Data model and migrations", p: "Urgent", e: "L", who: "Backend" },
  { id: "PAY-2", t: "Stripe webhooks with retries", p: "High", e: "M", who: "Backend" },
  { id: "PAY-3", t: "Test: webhook replay and refunds", p: "High", e: "S", who: "Tester" },
  { id: "PAY-4", t: "Dashboard, invoices view", p: "Medium", e: "M", who: "Frontend" },
  { id: "PAY-5", t: "Security review of payments", p: "High", e: "M", who: "Mirko" },
];

const TEAM = [
  { n: "Lead", r: "Orchestrator", b: "main", v: 1, c: GOLD },
  { n: "Ana", r: "Backend", b: "pay-1-models", v: 0.72, c: OK },
  { n: "Luka", r: "Backend", b: "pay-2-webhooks", v: 0.48, c: OK },
  { n: "Sara", r: "Frontend", b: "pay-4-invoices", v: 0.6, c: OK },
  { n: "Mirko", r: "Security", b: "review/pay", v: 0.35, c: "#8FB8E8" },
  { n: "Mika", r: "Tester", b: "test/pay-1", v: 0.84, c: "#8FB8E8" },
  { n: "Žika", r: "Tester", b: "test/pay-2", v: 0.22, c: "#8FB8E8" },
  { n: "Vesna", r: "Docs", b: "docs/api", v: 0.55, c: "#ffffff88" },
];

const ROUTES = [
  { t: "Plan and architecture", m: "Claude Opus", e: "high" },
  { t: "Webhook retry logic", m: "Codex", e: "high" },
  { t: "Invoices UI", m: "Claude", e: "medium" },
  { t: "Rename, lint fixes", m: "Fast model", e: "low" },
];

export default function AtelierDemo({ step }: DemoProps) {
  return (
    <Scene step={step}>
      {step === 0 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Relja · Atelier · one chat</Label>
          <motion.div
            className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-white/[0.09] px-4 py-3 text-[13px] leading-relaxed text-white/85"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Typed text="New client signed. Payments platform for a fintech, Stripe, admin dashboard, live in 3 weeks. Security matters most." speed={0.012} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.45, ease: EASE }}>
            <Card glow={GOLD} className="max-w-[90%]">
              <div className="flex items-center gap-2">
                <Live color={GOLD} />
                <Mono className="text-white/60">Orchestrator</Mono>
              </div>
              <p className="mt-2 text-[13px] text-white/85">Brief written. Two questions before I plan:</p>
              <Stagger gap={0.25} delay={2.1} className="mt-2 space-y-1">
                {["1. Which currencies at launch?", "2. Do refunds need a second approval?"].map((q) => (
                  <p key={q} className="font-mono text-[11px] text-white/65">
                    {q}
                  </p>
                ))}
              </Stagger>
            </Card>
          </motion.div>
          <p className="mt-auto max-w-sm text-[13px] text-white/50">I talk to one orchestrator. It already knows every past project.</p>
        </div>
      )}

      {step === 1 && (
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Plan · 5 of 38 tasks</Label>
            <Pill color={OK}>approved by Relja</Pill>
          </div>
          <Stagger gap={0.14} className="space-y-2">
            {PLAN.map((x) => (
              <div key={x.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <span className="size-2 shrink-0 rounded-full" style={{ background: PRIORITY[x.p] }} />
                <Mono className="w-12 shrink-0 text-white/40">{x.id}</Mono>
                <span className="flex-1 truncate text-[12.5px] text-white/85">{x.t}</span>
                <Mono className="hidden text-white/45 sm:inline">{x.who}</Mono>
                <span className="w-6 text-right font-mono text-[11px] text-white/55">{x.e}</span>
              </div>
            ))}
          </Stagger>
          <Mono className="mt-auto text-white/45">every feature has a test task · nothing starts before approval</Mono>
        </div>
      )}

      {step === 2 && (
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Team · 8 agents live</Label>
            <Pill color={OK}>
              <Live /> each in its own worktree
            </Pill>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-2">
            {TEAM.map((a, i) => (
              <motion.div
                key={a.n}
                className="flex flex-col justify-between rounded-xl border border-white/[0.07] bg-[#1b1b1e]/90 px-3 py-2"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 * i, duration: 0.4, ease: EASE }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-white/90">{a.n}</span>
                  <Live color={a.c} />
                </div>
                <Mono className="text-white/45">
                  {a.r} · {a.b}
                </Mono>
                <div className="mt-1.5">
                  <Bar value={a.v} color={a.c} delay={0.3 + 0.08 * i} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid h-full grid-cols-[1.15fr_1fr] gap-4">
          <div className="flex flex-col gap-2">
            <Label>Žika tests PAY-2 · clean context</Label>
            <Check label="webhook signature" pass delay={0} />
            <Check label="retry after timeout" pass delay={0.4} />
            <Check label="duplicate event ignored" pass={false} delay={0.8} />
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.4, ease: EASE }}>
              <Card glow={BAD}>
                <Mono className="text-white/50">sent back to Luka, with the log</Mono>
                <p className="mt-1 font-mono text-[11px] text-white/75">evt_3Q8 processed twice → refund issued twice</p>
              </Card>
            </motion.div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>12 minutes later</Label>
            <Check label="duplicate event ignored" pass delay={2.4} />
            <motion.div className="mt-auto space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.1, duration: 0.4 }}>
              <Mono className="block text-white/45">proof attached: test log · replay video</Mono>
              <Pill color={OK}>PAY-2 done</Pill>
            </motion.div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Every task to the model that fits it</Label>
          <Stagger gap={0.15} className="space-y-2">
            {ROUTES.map((r) => (
              <div key={r.t} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <span className="text-[12.5px] text-white/80">{r.t}</span>
                <span className="flex items-center gap-2">
                  <Mono className="text-white/85">{r.m}</Mono>
                  <Mono className="w-14 text-right text-white/40">{r.e}</Mono>
                </span>
              </div>
            ))}
          </Stagger>
          <Card className="mt-auto">
            <div className="mb-2 flex items-center justify-between">
              <Mono className="text-white/60">Fuel · this week</Mono>
              <Mono className="text-white/60">
                41% · brake at 80%
              </Mono>
            </div>
            <div className="relative">
              <Bar value={0.41} />
              <span className="absolute -top-1 h-3.5 w-px bg-[#F08C6B]" style={{ left: "80%" }} />
            </div>
          </Card>
        </div>
      )}

      {step === 5 && (
        <div className="grid h-full grid-cols-[1.2fr_1fr] gap-4">
          <div className="flex flex-col gap-2">
            <Label>03:12 · while Relja sleeps</Label>
            <Stagger gap={0.35} className="space-y-1.5">
              {[
                ["03:12", "webhook 500s on /stripe/events", BAD],
                ["03:12", "local model: expired signing secret", "#ffffffaa"],
                ["03:13", "rotated from vault, replayed 14 events", "#ffffffaa"],
                ["03:14", "tests green · logged for Relja", OK],
              ].map(([t, l, c]) => (
                <p key={l} className="font-mono text-[11px]">
                  <span className="text-white/35">{t}</span> <span style={{ color: c }}>{l}</span>
                </p>
              ))}
            </Stagger>
            <motion.div className="mt-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
              <Pill color={OK}>fixed · no call needed</Pill>
            </motion.div>
          </div>
          <motion.div
            className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-white/[0.1] bg-[#0f0f11] p-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.5, ease: EASE }}
          >
            <Mono className="text-white/40">04:40 · critical</Mono>
            <motion.div
              className="flex size-14 items-center justify-center rounded-full"
              style={{ background: `${OK}22`, border: `1px solid ${OK}66` }}
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ delay: 2.9, duration: 0.9, repeat: Infinity }}
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke={OK} strokeWidth="1.8">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
            </motion.div>
            <p className="text-center text-[13px] text-white/85">Atelier is calling Relja</p>
            <Mono className="text-center text-white/45">payouts paused · needs a decision</Mono>
          </motion.div>
        </div>
      )}
    </Scene>
  );
}
