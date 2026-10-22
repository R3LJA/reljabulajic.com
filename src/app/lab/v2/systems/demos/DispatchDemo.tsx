"use client";

import { motion } from "framer-motion";
import { BAD, Bar, Card, EASE, GOLD, Label, Live, Mono, OK, Pill, Scene, Stagger, Typed, type DemoProps } from "./kit";

// MOCKUP ONLY: invented loads, lanes and numbers for the Dispatch case study.

const BOARDS = [
  { name: "DAT", count: "1,284 loads" },
  { name: "Truckstop", count: "932 loads" },
  { name: "Broker emails", count: "41 offers" },
];

const LOADS = [
  { lane: "Dallas → Atlanta", rate: "$2.84", empty: "18 mi", score: 0.94 },
  { lane: "Fort Worth → Memphis", rate: "$2.61", empty: "41 mi", score: 0.88 },
  { lane: "Dallas → Denver", rate: "$2.47", empty: "12 mi", score: 0.81 },
];

const LANE = [2.9, 3.05, 2.8, 2.95, 3.1, 2.85, 3.0, 2.92, 2.98];

export default function DispatchDemo({ step }: DemoProps) {
  return (
    <Scene step={step}>
      {step === 0 && (
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Scanning · every 3 minutes</Label>
            <Pill color={OK}>
              <Live /> live
            </Pill>
          </div>
          <Stagger gap={0.3} className="space-y-3">
            {BOARDS.map((b) => (
              <Card key={b.name} className="flex items-center justify-between">
                <Mono className="text-white/85">{b.name}</Mono>
                <Mono className="text-white/45">{b.count}</Mono>
              </Card>
            ))}
          </Stagger>
          <Card glow={GOLD}>
            <Mono className="text-white/60">Trucks empty in the next 24h</Mono>
            <p className="mt-1 text-3xl tracking-[-0.04em] text-white">6 of 15</p>
          </Card>
          <p className="mt-auto max-w-sm text-[13px] text-white/50">It watches every board for every truck that is about to be empty.</p>
        </div>
      )}

      {step === 1 && (
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Truck 12 · Dallas, TX</Label>
            <Mono className="text-white/45">driver 7h 20m left · home by Fri</Mono>
          </div>
          <Stagger gap={0.25} className="space-y-2">
            {LOADS.map((l, i) => (
              <Card key={l.lane} glow={i === 0 ? GOLD : undefined}>
                <div className="flex items-center justify-between">
                  <Mono className="text-white/85">
                    {i + 1}. {l.lane}
                  </Mono>
                  <Mono className="text-white/60">
                    {l.rate}/mi · {l.empty} empty
                  </Mono>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Bar value={l.score} color={i === 0 ? GOLD : "#ffffff55"} delay={0.3 + i * 0.2} />
                  <Mono className="w-8 text-right text-white/70">{Math.round(l.score * 100)}</Mono>
                </div>
              </Card>
            ))}
          </Stagger>
          <p className="mt-auto max-w-sm text-[13px] text-white/50">Why #1: best pay per mile, pickup 18 miles away, fits the driver&apos;s hours.</p>
        </div>
      )}

      {step === 2 && (
        <div className="grid h-full grid-cols-[1.2fr_1fr] gap-4">
          <div className="flex flex-col gap-3">
            <Label>Draft to broker · not sent</Label>
            <Card>
              <p className="text-[13px] leading-relaxed text-white/80">
                <Typed text="Thanks for the Atlanta load. This lane averaged $2.95 a mile over 9 runs this quarter. We can take it at $2,300 and pick up today." />
              </p>
            </Card>
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 0.4, ease: EASE }}
            >
              <span className="rounded-lg px-3 py-1.5 text-[12px] text-black" style={{ background: GOLD }}>
                Approve and send
              </span>
              <span className="rounded-lg bg-white/10 px-3 py-1.5 text-[12px] text-white">Edit</span>
            </motion.div>
          </div>
          <div className="flex flex-col gap-3">
            <Label>Lane history · $/mi</Label>
            <div className="flex h-36 items-end gap-1.5">
              {LANE.map((v, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ background: `${GOLD}88` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(v - 2.4) * 120}%` }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.6, ease: EASE }}
                />
              ))}
              <motion.div
                className="flex-1 rounded-t"
                style={{ background: BAD }}
                initial={{ height: 0 }}
                animate={{ height: `${(2.63 - 2.4) * 120}%` }}
                transition={{ delay: 0.8, duration: 0.6, ease: EASE }}
              />
            </div>
            <Mono className="text-white/45">Their offer: $2.63/mi, below the lane</Mono>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid h-full grid-cols-[1fr_1fr] gap-4">
          <div className="flex flex-col gap-2">
            <Label>SMS · Luis, truck 12</Label>
            <Stagger gap={0.6} className="space-y-2">
              {[
                { me: true, t: "Hi Luis, what's your ETA to Memphis?" },
                { me: false, t: "Traffic on I-40, about 6:30" },
                { me: true, t: "Got it. Load updated and broker told. Drive safe." },
              ].map((m) => (
                <div key={m.t} className={`flex ${m.me ? "justify-start" : "justify-end"}`}>
                  <span className={`max-w-[85%] rounded-2xl px-3 py-2 text-[12px] ${m.me ? "bg-white/10 text-white" : "bg-[#cbb48a] text-black"}`}>{m.t}</span>
                </div>
              ))}
            </Stagger>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Load #48213</Label>
            <Stagger gap={0.5} delay={0.4} className="space-y-2">
              {[
                ["4:02 PM", "asked driver for ETA"],
                ["4:05 PM", "new ETA 6:30 PM, 90 min late"],
                ["4:06 PM", "broker warned 2 hours early"],
                ["6:34 PM", "delivered, proof received"],
              ].map(([t, e]) => (
                <p key={t} className="font-mono text-[11px] text-white/65">
                  <span className="text-[var(--gold)]">{t}</span> {e}
                </p>
              ))}
            </Stagger>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Load #48213 · documents read</Label>
          <Card className="p-0">
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 border-b border-white/[0.06] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
              <span>Field</span>
              <span>Rate con</span>
              <span>Invoice</span>
            </div>
            <Stagger gap={0.25} className="divide-y divide-white/[0.05]">
              {[
                ["Pickup", "Dallas, Oct 14", "Dallas, Oct 14", true],
                ["Delivery", "Atlanta, Oct 15", "Atlanta, Oct 15", true],
                ["Rate", "$2,400", "$2,200", false],
                ["Signed POD", "Required", "Attached", true],
              ].map(([f, a, b, ok]) => (
                <div key={f as string} className="grid grid-cols-[1fr_1fr_1fr] gap-3 px-4 py-2.5" style={ok ? undefined : { background: `${BAD}1f` }}>
                  <Mono className="text-white/60">{f}</Mono>
                  <Mono className="text-white/85">{a}</Mono>
                  <Mono className={ok ? "text-white/85" : "text-[#F08C6B]"}>{b}</Mono>
                </div>
              ))}
            </Stagger>
          </Card>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4, type: "spring", stiffness: 300, damping: 20 }}>
            <Pill color={BAD}>$200 short · fixed before sending</Pill>
          </motion.div>
          <p className="mt-auto max-w-sm text-[13px] text-white/50">Then the invoice goes to factoring the same day as delivery.</p>
        </div>
      )}

      {step === 5 && (
        <div className="grid h-full grid-cols-[1fr_1fr] gap-4">
          <div className="flex flex-col gap-3">
            <Label>Shipper, Memphis · from GPS</Label>
            <Card>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["Arrived", "8:02"],
                  ["Left", "11:42"],
                  ["Free", "2h"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <Mono className="text-white/40">{k}</Mono>
                    <p className="text-xl tracking-[-0.03em] text-white">{v}</p>
                  </div>
                ))}
              </div>
            </Card>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5, ease: EASE }}>
              <Card glow={GOLD}>
                <Label color={GOLD}>Detention claim</Label>
                <p className="mt-1 text-2xl tracking-[-0.03em] text-white">$150 ready</p>
                <Mono className="text-white/45">1h 40m over free time · proof attached</Mono>
              </Card>
            </motion.div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Action log</Label>
            <Stagger gap={0.2} delay={0.8} className="space-y-2">
              {[
                "11:42  geofence exit  truck 12",
                "11:42  detention 1h40m  load 48213",
                "11:43  claim drafted  $150",
                "11:51  approved by dispatcher",
                "11:51  sent to broker  with GPS log",
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
