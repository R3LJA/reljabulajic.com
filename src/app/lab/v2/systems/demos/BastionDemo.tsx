"use client";

import { motion } from "framer-motion";
import { BAD, Bar, Card, EASE, GOLD, Label, Live, Mono, OK, Pill, Scene, Stagger, type DemoProps } from "./kit";

// MOCKUP ONLY: invented dataset, training run and scores for the Bastion case study.

const LOSS = [2.4, 1.9, 1.5, 1.2, 0.95, 0.78, 0.64, 0.55, 0.48, 0.43, 0.4, 0.38, 0.37, 0.36];

const FIELDS = [
  { f: "Rate", ours: 0.995, gpt: 0.94 },
  { f: "Pickup date", ours: 0.991, gpt: 0.93 },
  { f: "Broker MC #", ours: 0.988, gpt: 0.86 },
  { f: "Accessorials", ours: 0.972, gpt: 0.81 },
];

export default function BastionDemo({ step }: DemoProps) {
  return (
    <Scene step={step}>
      {step === 0 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Dataset · client archive</Label>
          <Stagger gap={0.3} className="space-y-3">
            {[
              ["Rate confirmations", "18,420"],
              ["Bills of lading", "14,906"],
              ["Invoices", "6,731"],
            ].map(([k, v]) => (
              <Card key={k} className="flex items-center justify-between">
                <Mono className="text-white/85">{k}</Mono>
                <Mono className="text-white/45">{v}</Mono>
              </Card>
            ))}
          </Stagger>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.5, ease: EASE }}>
            <Card glow={GOLD}>
              <Mono className="text-white/60">Personal data masked</Mono>
              <p className="mt-1 font-mono text-[12px] text-white/80">
                &quot;Call <span className="rounded bg-white/15 px-1">[NAME]</span> at <span className="rounded bg-white/15 px-1">[PHONE]</span>&quot;
              </p>
            </Card>
          </motion.div>
          <p className="mt-auto max-w-sm text-[13px] text-white/50">40,057 past documents, cleaned. The model learns the format, not the people.</p>
        </div>
      )}

      {step === 1 && (
        <div className="grid h-full grid-cols-[1.1fr_1fr] gap-4">
          <motion.div
            className="rounded-xl bg-[#f1eee8] p-4 text-[#0e0e0f]"
            initial={{ rotate: -2, y: 24, opacity: 0 }}
            animate={{ rotate: -1, y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-black/50">Rate confirmation · #RC-20931</p>
            <div className="mt-3 space-y-1.5 font-mono text-[11px]">
              <p className="flex justify-between"><span>Linehaul</span><span>$2,150.00</span></p>
              <p className="flex justify-between"><span>Fuel surcharge</span><span>$250.00</span></p>
              <p className="flex justify-between"><span>Detention</span><span>$45/hr after 2h</span></p>
              <p className="flex justify-between"><span>Pick up</span><span>10/14 08:00</span></p>
            </div>
            <div className="mt-4 h-10 rounded bg-black/[0.06]" />
          </motion.div>
          <div className="flex flex-col gap-2">
            <Label>Correct answers</Label>
            <Stagger gap={0.2} delay={0.4} className="space-y-2">
              {['rate: 2400.00', 'pickup: 2026-10-14T08:00', 'detention: 45/h after 2h', 'checked by: person'].map((l) => (
                <p key={l} className="font-mono text-[11px] text-white/70">
                  {l}
                </p>
              ))}
            </Stagger>
            <div className="mt-auto">
              <Pill color={OK}>12,000 labelled</Pill>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Training · Qwen 2.5 7B · LoRA</Label>
            <Pill color={GOLD}>
              <Live color={GOLD} /> epoch 3 / 3
            </Pill>
          </div>
          <Card className="flex-1">
            <Mono className="text-white/45">loss</Mono>
            <div className="mt-3 flex h-[70%] items-end gap-1.5">
              {LOSS.map((v, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ background: i === LOSS.length - 1 ? GOLD : `${GOLD}66` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / 2.4) * 100}%` }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: EASE }}
                />
              ))}
            </div>
          </Card>
          <Mono className="text-white/45">1 machine · 3h 12m · data never left the office</Mono>
        </div>
      )}

      {step === 3 && (
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Held-out test · 2,000 unseen documents</Label>
            <span className="flex gap-3 font-mono text-[10px] text-white/50">
              <span style={{ color: GOLD }}>■ Bastion</span>
              <span>■ GPT</span>
            </span>
          </div>
          <div className="space-y-3">
            {FIELDS.map((x, i) => (
              <div key={x.f}>
                <div className="mb-1 flex justify-between">
                  <Mono className="text-white/75">{x.f}</Mono>
                  <Mono className="text-white/55">
                    {(x.ours * 100).toFixed(1)}% · {(x.gpt * 100).toFixed(0)}%
                  </Mono>
                </div>
                <Bar value={x.ours} delay={0.2 + i * 0.15} />
                <div className="mt-1">
                  <Bar value={x.gpt} color="#ffffff55" delay={0.3 + i * 0.15} />
                </div>
              </div>
            ))}
          </div>
          <motion.div className="mt-auto" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 20 }}>
            <Pill color={OK}>Better on every field · ship it</Pill>
          </motion.div>
        </div>
      )}

      {step === 4 && (
        <div className="grid h-full grid-cols-[1fr_1fr] gap-4">
          <div className="flex flex-col gap-3">
            <Label>On site · client office</Label>
            <Card glow={GOLD}>
              <div className="flex items-center justify-between">
                <Mono className="text-white/85">bastion-01</Mono>
                <Pill color={OK}>
                  <Live /> running
                </Pill>
              </div>
              <div className="mt-3 space-y-1.5">
                {[
                  ["GPU", "1 × RTX 6000"],
                  ["Internet", "not required"],
                  ["Speed", "0.8 s / document"],
                ].map(([k, v]) => (
                  <p key={k} className="flex justify-between font-mono text-[11px]">
                    <span className="text-white/45">{k}</span>
                    <span className="text-white/80">{v}</span>
                  </p>
                ))}
              </div>
            </Card>
          </div>
          <div className="flex flex-col gap-3">
            <Label>Outbound traffic</Label>
            <Card>
              <p className="text-4xl tracking-[-0.04em] text-white">0 B</p>
              <Mono className="text-white/45">sent outside this month</Mono>
            </Card>
            <Card>
              <p className="text-4xl tracking-[-0.04em]" style={{ color: GOLD }}>
                $0.0004
              </p>
              <Mono className="text-white/45">per document, API was $0.02</Mono>
            </Card>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="grid h-full grid-cols-[1fr_1fr] gap-4">
          <div className="flex flex-col gap-3">
            <Label>Low confidence · to a person</Label>
            <Card glow={BAD}>
              <Mono className="text-white/45">RC-21877 · accessorials</Mono>
              <p className="mt-1 text-[13px] text-white/85">&quot;Lumper reimbursed w/ receipt&quot;</p>
              <div className="mt-2 flex items-center gap-2">
                <Mono className="text-white/50">confidence</Mono>
                <Bar value={0.62} color={BAD} />
              </div>
            </Card>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.4, ease: EASE }}>
              <Pill color={OK}>corrected · saved for training</Pill>
            </motion.div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Versions</Label>
            <Stagger gap={0.25} delay={0.4} className="space-y-2">
              {[
                "v1  Oct 02  97.1%",
                "v2  Oct 09  97.9%",
                "v3  Oct 16  98.6%  live",
                "v4  training  +312 corrections",
              ].map((l) => (
                <p key={l} className="font-mono text-[11px] text-white/65">
                  {l}
                </p>
              ))}
            </Stagger>
          </div>
        </div>
      )}
    </Scene>
  );
}
