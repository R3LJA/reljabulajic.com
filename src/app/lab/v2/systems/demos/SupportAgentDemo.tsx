"use client";

import { motion } from "framer-motion";
import { BAD, Bar, Card, EASE, GOLD, Label, Live, Mono, OK, Pill, Scene, Stagger, Typed, type DemoProps } from "./kit";

const BLUE = "#38BDF8";

const INBOX = [
  { app: "Vael", ch: "chat", text: "I was charged twice this month, I want a refund.", hot: true },
  { app: "AirPosture", ch: "email", text: "How do I pair my AirPods Max?", hot: false },
  { app: "Recite", ch: "chat", text: "Can I export my scores?", hot: false },
];

function Msg({ app, ch, text, hot }: (typeof INBOX)[number]) {
  return (
    <Card glow={hot ? GOLD : undefined} className="flex items-start gap-3">
      <span className="mt-0.5 rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/70">{app}</span>
      <span className="flex-1 text-[13px] text-white/85">{text}</span>
      <Mono className="text-white/35">{ch}</Mono>
    </Card>
  );
}

export default function SupportAgentDemo({ step }: DemoProps) {
  return (
    <Scene step={step}>
      {step === 0 && (
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Inbox · 3 apps, chat and email</Label>
            <span className="flex items-center gap-2 font-mono text-[10px] text-white/45"><Live color={BLUE} /> live</span>
          </div>
          <Stagger gap={0.4} className="space-y-3">
            {INBOX.map((m) => <Msg key={m.text} {...m} />)}
          </Stagger>
        </div>
      )}

      {step === 1 && (
        <div className="grid h-full grid-cols-[1.2fr_1fr] gap-4">
          <div className="flex flex-col gap-3">
            <Label>Conversation</Label>
            <Msg {...INBOX[0]} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Who is writing</Label>
            <Stagger gap={0.18} className="space-y-2">
              {[
                ["App", "Vael 2.3.1"],
                ["Device", "iPhone 16, iOS 26"],
                ["Plan", "Pro, yearly"],
                ["History", "2 earlier tickets, resolved"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between rounded-xl border border-white/[0.06] px-3 py-2">
                  <Mono className="text-white/45">{k}</Mono>
                  <Mono className="text-white/85">{v}</Mono>
                </div>
              ))}
            </Stagger>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Knowledge · Vael only</Label>
          <Stagger gap={0.25} className="space-y-3">
            {[
              ["Billing: duplicate charges", 0.91],
              ["Refund policy, App Store purchases", 0.84],
              ["Restore purchases", 0.42],
            ].map(([t, s]) => (
              <Card key={t as string}>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-white/85">{t}</span>
                  <Mono className="text-white/45">{(s as number).toFixed(2)}</Mono>
                </div>
                <div className="mt-2"><Bar value={s as number} color={BLUE} delay={0.3} /></div>
              </Card>
            ))}
          </Stagger>
          <p className="mt-auto text-[13px] text-white/50">Other apps&apos; knowledge never leaks into this answer.</p>
        </div>
      )}

      {step === 3 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Claude · structured decision</Label>
          <Card className="font-mono text-[12px] leading-6 text-white/80">
            <p>{"{"}</p>
            <p className="pl-4"><Typed text={'"category": "billing.refund",'} delay={0.1} /></p>
            <p className="pl-4"><Typed text={'"sentiment": "frustrated",'} delay={0.7} /></p>
            <p className="pl-4">
              <Typed text={'"confidence": '} delay={1.3} />
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} style={{ color: BAD }}>0.42</motion.span>,
            </p>
            <p className="pl-4">
              <Typed text={'"escalate": '} delay={1.9} />
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.15 }} style={{ color: GOLD }}>true</motion.span>,
            </p>
            <p className="pl-4"><Typed text={'"summary": "Double charge on Pro yearly, asks for refund"'} delay={2.4} speed={0.012} /></p>
            <p>{"}"}</p>
          </Card>
          <p className="mt-auto text-[13px] text-white/50">Refunds never go out on their own, however sure the wording sounds.</p>
        </div>
      )}

      {step === 4 && (
        <div className="grid h-full grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <Label color={OK}>Answered automatically</Label>
            <Card>
              <p className="text-[13px] text-white/85">How do I pair my AirPods Max?</p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-2 text-[12px] text-white/55">
                Open Settings, then Bluetooth… (from the AirPosture guide)
              </motion.p>
              <div className="mt-3"><Pill color={OK}>sent · 0.93</Pill></div>
            </Card>
          </div>
          <motion.div className="flex flex-col gap-3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6, ease: EASE }}>
            <Label color={GOLD}>Human review queue</Label>
            <Card glow={GOLD}>
              <p className="text-[13px] text-white/85">Double charge on Pro yearly, asks for refund</p>
              <p className="mt-2 text-[12px] text-white/55">Suggested reply ready · full thread attached</p>
              <div className="mt-3 flex gap-2"><Pill color={GOLD}>refund</Pill><Pill color={BAD}>frustrated</Pill></div>
            </Card>
          </motion.div>
        </div>
      )}

      {step === 5 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Operator correction → knowledge</Label>
          <Card>
            <p className="font-mono text-[11px] text-white/45">AI suggested</p>
            <p className="mt-1 text-[13px] text-white/50 line-through">Refunds are handled by Apple, please contact them.</p>
            <p className="mt-3 font-mono text-[11px] text-white/45">Operator sent</p>
            <p className="mt-1 text-[13px] text-white/85">Confirmed, it&apos;s a duplicate. Here is the one-tap refund request, and I&apos;ve flagged your account.</p>
          </Card>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5, ease: EASE }}>
            <Card glow={BLUE}>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-white/85">Suggested article: duplicate charge refunds</span>
                <Pill color={BLUE}>new</Pill>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </Scene>
  );
}
