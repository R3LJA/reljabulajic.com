"use client";

import { motion } from "framer-motion";
import { BAD, Card, EASE, GOLD, Label, Live, Mono, OK, Pill, Scene, Stagger, Typed, type DemoProps } from "./kit";

const VIOLET = "#A78BFA";

const SOURCES = [
  { s: "Web", f: "Ships route-planning SaaS to mid-size carriers" },
  { s: "Jobs", f: "Hiring a RevOps lead, posted 6 days ago" },
  { s: "News", f: "Raised a Series B, two sources" },
  { s: "Registry", f: "Delaware C-corp, 2019" },
  { s: "GitHub", f: "Public API SDKs, active this week" },
];

export default function DeepLeadDemo({ step }: DemoProps) {
  return (
    <Scene step={step}>
      {step === 0 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Ideal customer profile</Label>
          <Stagger gap={0.2} className="grid grid-cols-2 gap-3">
            {[
              ["Industry", "Logistics software"],
              ["Size", "50 to 200 people"],
              ["Region", "United States"],
              ["Signal", "Hiring revenue operations"],
            ].map(([k, v]) => (
              <Card key={k}>
                <Label>{k}</Label>
                <p className="mt-2 text-[15px] text-white/90">{v}</p>
              </Card>
            ))}
          </Stagger>
          <p className="mt-auto text-[13px] text-white/50">Every agent downstream works from this brief, not from a vague prompt.</p>
        </div>
      )}

      {step === 1 && (
        <div className="flex h-full flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Label>Research agents · 5 sources</Label>
            <span className="flex items-center gap-2 font-mono text-[10px] text-white/45"><Live color={VIOLET} /> running</span>
          </div>
          <Stagger gap={0.3} className="space-y-2.5">
            {SOURCES.map((x) => (
              <Card key={x.s} className="flex items-center gap-3 py-3">
                <span className="w-16 font-mono text-[10px] uppercase tracking-wider" style={{ color: VIOLET }}>{x.s}</span>
                <span className="text-[13px] text-white/80">{x.f}</span>
              </Card>
            ))}
          </Stagger>
        </div>
      )}

      {step === 2 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Identity resolution</Label>
          <div className="relative grid grid-cols-2 gap-3">
            {["Dana Kim · VP Revenue · LinkedIn", "D. Kim · Head of Sales · company site"].map((t, i) => (
              <motion.div
                key={t}
                initial={{ x: 0 }}
                animate={{ x: i === 0 ? "52%" : "-52%", opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
              >
                <Card><p className="text-[13px] text-white/80">{t}</p></Card>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}>
            <Card glow={VIOLET}>
              <div className="flex items-center justify-between">
                <span className="text-[15px] text-white">Dana Kim, VP Revenue</span>
                <Pill color={OK}>same person · 0.94</Pill>
              </div>
              <p className="mt-2 font-mono text-[11px] text-white/45">matched on employer, title history and public email domain</p>
            </Card>
          </motion.div>
        </div>
      )}

      {step === 3 && (
        <div className="flex h-full flex-col gap-2.5">
          <Label>Semantic critic</Label>
          <Stagger gap={0.35} className="space-y-2.5">
            {[
              ["Raised a Series B", "2 sources agree", true],
              ["Hiring a RevOps lead", "job post, dated", true],
              ["Revenue around $40M", "single blog estimate", false],
              ["Uses Salesforce", "job post mentions it", true],
            ].map(([claim, why, ok]) => (
              <Card key={claim as string} className="flex items-center justify-between py-3">
                <span>
                  <span className={`text-[13px] ${ok ? "text-white/85" : "text-white/45 line-through decoration-[#F08C6B]"}`}>{claim}</span>
                  <span className="ml-3 font-mono text-[11px] text-white/40">{why}</span>
                </span>
                <Pill color={ok ? OK : BAD}>{ok ? "kept" : "rejected"}</Pill>
              </Card>
            ))}
          </Stagger>
        </div>
      )}

      {step === 4 && (
        <div className="grid h-full grid-cols-[1fr_1.2fr] items-center gap-6">
          <div className="relative mx-auto aspect-square w-[min(190px,100%)]">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none" stroke={VIOLET} strokeWidth="7" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 0.86 }} transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl tracking-[-0.04em] text-white"><Typed text="86" delay={0.9} speed={0.2} /></span>
              <Mono className="text-white/45">fit</Mono>
            </div>
          </div>
          <Stagger gap={0.2} className="space-y-2.5">
            {[
              ["Fit", "Matches all 4 profile criteria", OK],
              ["Timing", "Hiring signal is 6 days old", OK],
              ["Risk", "Low, no conflicts found", OK],
              ["Evidence", "4 claims kept, 1 rejected", GOLD],
            ].map(([k, v, c]) => (
              <div key={k as string} className="flex items-center justify-between rounded-xl border border-white/[0.06] px-3 py-2">
                <Mono className="text-white/45">{k}</Mono>
                <span className="text-[13px]" style={{ color: c as string }}>{v}</span>
              </div>
            ))}
          </Stagger>
        </div>
      )}

      {step === 5 && (
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Draft · waiting for approval</Label>
            <Mono className="text-white/45">cost $0.38 of $2.00 budget</Mono>
          </div>
          <Card>
            <p className="font-mono text-[11px] text-white/45">To: Dana Kim</p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/85">
              <Typed text="Saw you're hiring a RevOps lead after the Series B. Teams at that stage usually rebuild their pipeline reporting first…" speed={0.012} />
            </p>
            <p className="mt-2 font-mono text-[11px] text-white/40">every sentence links to its source</p>
          </Card>
          <motion.div className="mt-auto flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
            <span className="rounded-full px-4 py-2 text-[12px] text-black" style={{ background: GOLD }}>Approve and send</span>
            <span className="rounded-full border border-white/15 px-4 py-2 text-[12px] text-white/70">Edit</span>
          </motion.div>
        </div>
      )}
    </Scene>
  );
}
