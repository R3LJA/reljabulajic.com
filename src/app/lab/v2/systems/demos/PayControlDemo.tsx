"use client";

import { motion } from "framer-motion";
import { BAD, Card, Check, EASE, GOLD, Label, Live, Mono, OK, Pill, Scene, Stagger, type DemoProps } from "./kit";

const TX = [
  { id: "txn_838", merchant: "Netflix", amount: "$15.49", cat: "Entertainment" },
  { id: "txn_839", merchant: "Steam", amount: "$9.99", cat: "Games" },
  { id: "txn_841", merchant: "Wire-X", amount: "$220.00", cat: "Transfers" },
];

export default function PayControlDemo({ step }: DemoProps) {
  return (
    <Scene step={step}>
      {step === 0 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Incoming · Plaid webhooks</Label>
          <Stagger gap={0.35} className="space-y-3">
            {["TRANSACTIONS · SYNC_UPDATES_AVAILABLE", "TRANSACTIONS · SYNC_UPDATES_AVAILABLE", "ITEM · WEBHOOK_UPDATE_ACKNOWLEDGED"].map((t, i) => (
              <Card key={i} className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <Live color={GOLD} />
                  <Mono className="text-white/85">{t}</Mono>
                </span>
                <Mono className="text-white/40">item_7Fq…{i + 2}c · 00:0{i}</Mono>
              </Card>
            ))}
          </Stagger>
          <p className="mt-auto max-w-sm text-[13px] text-white/50">The bank tells the backend something changed. Nothing is trusted yet.</p>
        </div>
      )}

      {step === 1 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Idempotent sync</Label>
          <Card>
            <div className="flex items-center justify-between">
              <Mono className="text-white/85">cursor 4f2a… → 4f2b…</Mono>
              <Pill color={OK}>applied</Pill>
            </div>
          </Card>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6, ease: EASE }}>
            <Card glow={BAD}>
              <div className="flex items-center justify-between">
                <Mono className="text-white/60 line-through decoration-[#F08C6B]">cursor 4f2a… → 4f2b… (retry)</Mono>
                <Pill color={BAD}>duplicate · ignored</Pill>
              </div>
              <p className="mt-2 font-mono text-[11px] text-white/40">idempotency key already processed, no new rows written</p>
            </Card>
          </motion.div>
          <p className="mt-auto max-w-sm text-[13px] text-white/50">The same webhook twice cannot create the same transaction twice.</p>
        </div>
      )}

      {step === 2 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Transaction ledger · PostgreSQL</Label>
          <Card className="p-0">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-3 border-b border-white/[0.06] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
              <span>Merchant</span>
              <span>Category</span>
              <span>Amount</span>
            </div>
            <Stagger gap={0.25} className="divide-y divide-white/[0.05]">
              {TX.map((t) => (
                <div key={t.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 px-4 py-3">
                  <Mono className="text-white/85">{t.merchant}</Mono>
                  <Mono className="text-white/45">{t.cat}</Mono>
                  <Mono className="text-white/85">{t.amount}</Mono>
                </div>
              ))}
            </Stagger>
          </Card>
          <p className="mt-auto max-w-sm text-[13px] text-white/50">One source of truth, every row from a migration-backed model.</p>
        </div>
      )}

      {step === 3 && (
        <div className="grid h-full grid-cols-[1fr_1.1fr] gap-4">
          <div className="flex flex-col gap-3">
            <Label>Evaluating</Label>
            <Card glow={GOLD}>
              <Mono className="text-white/45">txn_841</Mono>
              <p className="mt-1 text-2xl font-medium tracking-[-0.03em] text-white">Wire-X</p>
              <p className="mt-1 text-3xl tracking-[-0.04em] text-white">$220.00</p>
            </Card>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.1, type: "spring", stiffness: 300, damping: 18 }}>
              <Pill color={GOLD}>verdict · review</Pill>
            </motion.div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Policy engine</Label>
            <Check label="Daily limit $150" pass={false} delay={0} />
            <Check label="Category allowed" pass delay={0.4} />
            <Check label="Merchant allow-list" pass={false} delay={0.8} />
            <Check label="Velocity < 5 / hour" pass delay={1.2} />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex h-full items-center justify-center gap-8">
          <div className="hidden max-w-[12rem] text-[13px] text-white/50 md:block">Server-sent events push the decision to the parent the moment it is made.</div>
          <motion.div
            className="w-[min(260px,70%)] rounded-[34px] border border-white/10 bg-black p-3 shadow-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="rounded-[26px] bg-gradient-to-b from-[#1c1c20] to-[#101012] p-4">
              <p className="text-center font-mono text-[10px] text-white/40">9:41</p>
              <motion.div
                className="mt-6 rounded-2xl bg-white/10 p-3 backdrop-blur"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/50">PayControl · now</p>
                <p className="mt-1 text-[13px] font-medium text-white">Wire-X $220.00 needs your review</p>
                <p className="text-[12px] text-white/55">Over the daily limit, merchant not on the list.</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <span className="rounded-lg bg-white/10 py-1.5 text-center text-[12px] text-white">Decline</span>
                  <span className="rounded-lg py-1.5 text-center text-[12px] text-black" style={{ background: GOLD }}>Approve</span>
                </div>
              </motion.div>
              <div className="h-40" />
            </div>
          </motion.div>
        </div>
      )}

      {step === 5 && (
        <div className="grid h-full grid-cols-[1fr_1fr] gap-4">
          <motion.div
            className="rounded-xl bg-[#f1eee8] p-4 text-[#0e0e0f]"
            initial={{ rotate: -3, y: 30, opacity: 0 }}
            animate={{ rotate: -1.5, y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-black/50">Monthly report · PDF</p>
            <p className="mt-2 text-lg font-medium tracking-[-0.02em]">Family spending, October</p>
            <div className="mt-3 space-y-1.5 font-mono text-[11px]">
              <p className="flex justify-between"><span>Transactions</span><span>142</span></p>
              <p className="flex justify-between"><span>Allowed</span><span>131</span></p>
              <p className="flex justify-between"><span>Notified</span><span>7</span></p>
              <p className="flex justify-between"><span>Reviewed by parent</span><span>4</span></p>
            </div>
            <div className="mt-4 h-12 rounded bg-black/[0.06]" />
          </motion.div>
          <div className="flex flex-col gap-2">
            <Label>Audit trail</Label>
            <Stagger gap={0.2} className="space-y-2">
              {[
                "02:14:07  webhook received  item_7Fq…2c",
                "02:14:07  duplicate ignored  key a91…",
                "02:14:08  rule fail  daily_limit  txn_841",
                "02:14:08  sse push  parent:2",
                "02:15:31  approved by parent  txn_841",
              ].map((l) => (
                <p key={l} className="font-mono text-[11px] text-white/65">{l}</p>
              ))}
            </Stagger>
          </div>
        </div>
      )}
    </Scene>
  );
}
