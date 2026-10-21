"use client";

import { motion } from "framer-motion";
import { Card, EASE, GOLD, Label, Mono, OK, Pill, Scene, Stagger, Typed, type DemoProps } from "./kit";

const MINT = "#6EE7B7";

function Wave() {
  return (
    <div className="flex h-24 items-center justify-center gap-[3px]">
      {Array.from({ length: 48 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full"
          style={{ background: MINT }}
          animate={{ height: [6, 10 + ((i * 37) % 60), 6] }}
          transition={{ duration: 0.9 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut", delay: (i % 8) * 0.07 }}
        />
      ))}
    </div>
  );
}

const SAID = "Remind me to send the deck to Ana after our call tomorrow";

export default function VoiceVaultDemo({ step }: DemoProps) {
  return (
    <Scene step={step}>
      {step === 0 && (
        <div className="flex h-full flex-col items-center justify-center gap-6">
          <Wave />
          <motion.span
            className="flex size-16 items-center justify-center rounded-full"
            style={{ background: `${MINT}22`, border: `1px solid ${MINT}66` }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <span className="size-5 rounded-full" style={{ background: MINT }} />
          </motion.span>
          <p className="max-w-md text-center text-[15px] text-white/85">“<Typed text={SAID} speed={0.03} />”</p>
        </div>
      )}

      {step === 1 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Transcript · repaired</Label>
          <Card>
            <p className="font-mono text-[11px] text-white/40">raw</p>
            <p className="mt-1 text-[14px] text-white/55">remind me to send the deck to anna after our cal tomorrow</p>
          </Card>
          <Card glow={MINT}>
            <p className="font-mono text-[11px] text-white/40">repaired</p>
            <p className="mt-1 text-[14px] text-white/90">
              Remind me to send the deck to{" "}
              <motion.span className="rounded px-1" initial={{ background: "rgba(110,231,183,0)" }} animate={{ background: "rgba(110,231,183,0.22)" }} transition={{ delay: 0.6 }}>Ana</motion.span>{" "}
              after our{" "}
              <motion.span className="rounded px-1" initial={{ background: "rgba(110,231,183,0)" }} animate={{ background: "rgba(110,231,183,0.22)" }} transition={{ delay: 0.9 }}>call</motion.span>{" "}
              tomorrow.
            </p>
            <p className="mt-2 font-mono text-[11px] text-white/40">name matched to contacts · “cal” fixed from context</p>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Intent and entities</Label>
          <Stagger gap={0.2} className="grid grid-cols-2 gap-3">
            {[
              ["intent", "create_reminder"],
              ["person", "Ana Petrović"],
              ["object", "the deck"],
              ["when", "after call, tomorrow"],
            ].map(([k, v]) => (
              <Card key={k}>
                <Label color={MINT}>{k}</Label>
                <p className="mt-2 font-mono text-[13px] text-white/90">{v}</p>
              </Card>
            ))}
          </Stagger>
        </div>
      )}

      {step === 3 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Context resolution</Label>
          <Card>
            <p className="font-mono text-[11px] text-white/40">memory · calendar note</p>
            <p className="mt-1 text-[14px] text-white/85">Call with Ana, Thu 14:00 to 14:45</p>
          </Card>
          <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <span className="h-px flex-1" style={{ background: `${MINT}66` }} />
            <Mono className="text-white/50">“after our call” resolves to</Mono>
            <span className="h-px flex-1" style={{ background: `${MINT}66` }} />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: "spring", stiffness: 260, damping: 20 }}>
            <Card glow={MINT}>
              <p className="text-[20px] tracking-[-0.03em] text-white">Thursday, 14:50</p>
            </Card>
          </motion.div>
        </div>
      )}

      {step === 4 && (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <motion.div className="w-full max-w-sm" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: EASE }}>
            <Card glow={MINT}>
              <div className="flex items-center justify-between">
                <Label color={MINT}>Reminder created</Label>
                <Pill color={OK}>done</Pill>
              </div>
              <p className="mt-2 text-[16px] text-white">Send the deck to Ana</p>
              <p className="text-[13px] text-white/55">Thursday 14:50, after your call</p>
            </Card>
          </motion.div>
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between">
              <Mono className="text-white/50">Undo</Mono>
              <Mono className="text-white/35">5 s</Mono>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div className="h-full" style={{ background: GOLD }} initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 5, ease: "linear" }} />
            </div>
          </div>
          <p className="max-w-sm text-center text-[13px] text-white/50">Low-risk actions run at once with an undo; sensitive ones ask first.</p>
        </div>
      )}

      {step === 5 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Ask your memory</Label>
          <Card>
            <p className="text-[14px] text-white/90">“<Typed text="What did I promise Ana?" speed={0.035} />”</p>
          </Card>
          <Stagger gap={0.25} delay={1} className="space-y-2.5">
            {[
              ["Send the deck after Thursday's call", "reminder · Thu"],
              ["Share the pricing sheet by Friday", "note · last week"],
            ].map(([t, m]) => (
              <Card key={t} className="flex items-center justify-between py-3">
                <span className="text-[13px] text-white/85">{t}</span>
                <Mono className="text-white/40">{m}</Mono>
              </Card>
            ))}
          </Stagger>
        </div>
      )}
    </Scene>
  );
}
