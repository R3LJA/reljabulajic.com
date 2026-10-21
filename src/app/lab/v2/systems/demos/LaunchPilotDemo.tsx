"use client";

import { motion } from "framer-motion";
import { BAD, Card, Check, EASE, GOLD, Label, Live, Mono, OK, Pill, Scene, Stagger, type DemoProps } from "./kit";

const BLUE = "#7DB8E8";

const TASKS = ["Market research", "Positioning", "3 post drafts", "Visuals", "Schedule"];

const ROUTES = [
  { task: "Strategy and positioning", model: "Claude", ok: true },
  { task: "Copy variants", model: "OpenAI", ok: true },
  { task: "Image understanding", model: "Gemini", ok: true },
  { task: "Trend scan", model: "Grok", ok: false },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function LaunchPilotDemo({ step }: DemoProps) {
  return (
    <Scene step={step}>
      {step === 0 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Brief</Label>
          <Card>
            <p className="text-[15px] text-white/90">Launch a habit-tracking app to remote workers.</p>
            <p className="mt-1 text-[13px] text-white/50">Goal: 3 posts a week on X and LinkedIn, one voice, no hype.</p>
          </Card>
          <Label>Research notes</Label>
          <Stagger gap={0.25} className="space-y-2">
            {["Audience complains about burnout, not productivity", "Competitors lead with streaks; nobody leads with rest", "Best posting window: 8 to 10 am ET"].map((n) => (
              <p key={n} className="flex gap-2 text-[13px] text-white/75"><span style={{ color: BLUE }}>•</span>{n}</p>
            ))}
          </Stagger>
        </div>
      )}

      {step === 1 && (
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Orchestrator · tool loop</Label>
            <span className="flex items-center gap-2 font-mono text-[10px] text-white/45"><Live color={BLUE} /> 5 jobs</span>
          </div>
          <div className="relative flex flex-1 items-center">
            <Card glow={BLUE} className="z-[1] shrink-0">
              <Label>Run</Label>
              <p className="mt-1 text-[15px] text-white">launch-week-12</p>
            </Card>
            <div className="ml-6 flex-1 space-y-2">
              {TASKS.map((t, i) => (
                <motion.div
                  key={t}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.18, duration: 0.45, ease: EASE }}
                >
                  <span className="h-px w-6" style={{ background: `${BLUE}88` }} />
                  <span className="flex flex-1 items-center justify-between rounded-xl border border-white/[0.07] px-3 py-1.5">
                    <Mono className="text-white/80">{t}</Mono>
                    <Mono className="text-white/35">queued</Mono>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex h-full flex-col gap-2.5">
          <Label>Model routing</Label>
          <Stagger gap={0.25} className="space-y-2.5">
            {ROUTES.map((r) => (
              <Card key={r.task} className="flex items-center justify-between py-3">
                <span className="text-[13px] text-white/80">{r.task}</span>
                <span className="flex items-center gap-2">
                  <Mono className={r.ok ? "text-white/85" : "text-white/40 line-through decoration-[#F08C6B]"}>{r.model}</Mono>
                  {!r.ok && (
                    <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }}>
                      <Pill color={GOLD}>timeout → Claude</Pill>
                    </motion.span>
                  )}
                </span>
              </Card>
            ))}
          </Stagger>
          <p className="mt-auto text-[13px] text-white/50">A provider failing changes the route, not the outcome.</p>
        </div>
      )}

      {step === 3 && (
        <div className="grid h-full grid-cols-[1.1fr_1fr] gap-4">
          <Card>
            <Label>Draft 2 of 3</Label>
            <p className="mt-2 text-[13px] leading-relaxed text-white/85">
              Rest is a feature. Most trackers punish you for missing a day; this one plans the day off with you.
            </p>
            <motion.p className="mt-2 text-[13px] text-white/40 line-through decoration-[#F08C6B]" initial={{ opacity: 1 }} animate={{ opacity: 0.6 }} transition={{ delay: 1.8 }}>
              Clinically proven to cut burnout by 40%.
            </motion.p>
          </Card>
          <div className="flex flex-col gap-2">
            <Label>Review and policy gates</Label>
            <Check label="Brand voice" pass delay={0} />
            <Check label="Length and format" pass delay={0.35} />
            <Check label="No unproven claims" pass={false} delay={0.7} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
              <Pill color={GOLD}>claim removed · revised</Pill>
            </motion.div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex h-full flex-col gap-3">
          <Label>Publishing calendar</Label>
          <div className="grid flex-1 grid-cols-5 gap-2">
            {DAYS.map((d, i) => (
              <div key={d} className="flex flex-col gap-2 rounded-xl border border-white/[0.06] p-2">
                <Mono className="text-white/45">{d}</Mono>
                {[0, 2, 4].includes(i) && (
                  <motion.div
                    className="rounded-lg p-2"
                    style={{ background: `${BLUE}1f`, border: `1px solid ${BLUE}55` }}
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 300, damping: 22 }}
                  >
                    <Mono className="text-white/85">09:00</Mono>
                    <p className="mt-1 text-[11px] text-white/60">{i === 2 ? "LinkedIn" : "X"}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="flex h-full flex-col gap-2.5">
          <Label>Jobs · telemetry</Label>
          <Stagger gap={0.22} className="space-y-2.5">
            {[
              ["publish · X · Mon 09:00", "done", OK],
              ["publish · LinkedIn · Wed 09:00", "token expired", BAD],
              ["refresh OAuth · LinkedIn", "done", OK],
              ["publish · LinkedIn · Wed 09:00 (retry)", "done", OK],
            ].map(([j, s, c]) => (
              <Card key={j as string} className="flex items-center justify-between py-3">
                <Mono className="text-white/80">{j}</Mono>
                <Pill color={c as string}>{s}</Pill>
              </Card>
            ))}
          </Stagger>
          <p className="mt-auto text-[13px] text-white/50">Failures are visible, retried once, and never silent.</p>
        </div>
      )}
    </Scene>
  );
}
