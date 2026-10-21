"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import trace from "./intake-trace.json";

// Replays steps 2 and 3 of the recorded intake run (read the uploads, then the
// rule checks) from intake-trace.json, which is cut from
// ophand/public/demo-runs/kessler.json. The clock shows the recorded run time.
// Gaps between events are played SPEED times faster, never under MIN_GAP ms.

const SPEED = 8;
const MIN_GAP = 420;

type Frame =
  | {
      kind: "read";
      ms: number;
      file: string;
      form: string;
      payer: string;
      year: number;
    }
  | { kind: "rule"; ms: number; file: string; title: string };

const readStep = trace.steps.find((s) => s.step === "read")!;
const START = readStep.start_ms;

const FRAMES: Frame[] = [
  ...trace.reads.map((r): Frame => ({
    kind: "read",
    ms: r.ms,
    file: r.file,
    form: r.form,
    payer: r.payer,
    year: r.tax_year,
  })),
  {
    kind: "rule",
    ms: trace.rule!.ms,
    file: trace.rule!.file,
    title: trace.rule!.title,
  },
];

const STEP_NAMES: Record<string, string> = {
  checklist: "Build the list",
  read: "Read uploads",
  rules: "Rules in code",
  review: "Review and draft",
};

const fmt = (ms: number) => {
  const s = ms / 1000;
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${(s - m * 60).toFixed(1).padStart(4, "0")}`;
};

const recordedDate = new Date(trace.recorded_at).toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

type RowState = { label: string; tone: "wait" | "ok" | "bad" | "new" };

export default function ReplayStep() {
  const [shown, setShown] = useState(0); // frames revealed
  const [clock, setClock] = useState(START);
  const [state, setState] = useState<"idle" | "playing" | "done">("idle");
  const timers = useRef<number[]>([]);
  const raf = useRef<number | null>(null);

  const stop = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const play = () => {
    stop();
    setShown(0);
    setClock(START);
    setState("playing");
    let at = 0;
    let prevMs = START;
    const schedule: { at: number; dur: number; from: number; to: number }[] =
      [];
    FRAMES.forEach((f, i) => {
      const dur = Math.max(MIN_GAP, (f.ms - prevMs) / SPEED);
      schedule.push({ at, dur, from: prevMs, to: f.ms });
      at += dur;
      timers.current.push(
        window.setTimeout(() => {
          setShown(i + 1);
          if (i === FRAMES.length - 1) {
            setState("done");
            setClock(f.ms);
          }
        }, at),
      );
      prevMs = f.ms;
    });
    const t0 = performance.now();
    const tick = (now: number) => {
      const el = now - t0;
      const seg = schedule.find((s) => el >= s.at && el < s.at + s.dur);
      if (seg)
        setClock(seg.from + ((el - seg.at) / seg.dur) * (seg.to - seg.from));
      if (el < at) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const skip = () => {
    stop();
    setShown(FRAMES.length);
    setClock(FRAMES[FRAMES.length - 1].ms);
    setState("done");
  };

  const visible = FRAMES.slice(0, shown);

  // Checklist state derived from the frames shown so far.
  const rows = useMemo(() => {
    const expected = trace.checklist.filter((r) => r.id.startsWith("E"));
    const map = new Map<string, RowState>(
      expected.map((r) => [r.id, { label: "Waiting", tone: "wait" }]),
    );
    const extra: { key: string; form: string; payer: string; label: string }[] =
      [];
    for (const f of visible) {
      if (f.kind === "read") {
        const row = expected.find((r) => r.payer === f.payer);
        if (row) map.set(row.id, { label: "Received", tone: "ok" });
        else
          extra.push({
            key: f.file,
            form: f.form,
            payer: f.payer,
            label: "New this year",
          });
      } else {
        map.set("E2", { label: "Wrong year", tone: "bad" });
      }
    }
    if (state === "done") {
      for (const r of expected) {
        if (map.get(r.id)?.tone === "wait")
          map.set(r.id, { label: "Not uploaded", tone: "bad" });
      }
    }
    return { expected, map, extra };
  }, [visible, state]);

  return (
    <section className="cf-replay" aria-labelledby="cf-replay-title">
      <div className="cf-replay-top">
        <div>
          <p className="cf-kicker cf-kicker-accent">
            Replay of a recorded run, {recordedDate}
          </p>
          <h3 id="cf-replay-title" className="cf-replay-title">
            Steps 2 and 3: reading the uploads, then the rule check.
          </h3>
        </div>
        <div className="cf-replay-controls">
          <span className="cf-replay-clock" aria-label="Recorded run time">
            t+{fmt(clock)}
          </span>
          <button type="button" className="cf-btn cf-btn-ink" onClick={play}>
            {state === "idle" ? "Play" : "Replay"}
          </button>
          <button
            type="button"
            className="cf-btn"
            onClick={skip}
            disabled={state === "done"}
          >
            Skip to end
          </button>
        </div>
      </div>

      <ol className="cf-steps" aria-label="The four steps of the recorded run">
        {trace.steps.map((s, i) => {
          const dur = s.end_ms - s.start_ms;
          const active = s.step === "read" || s.step === "rules";
          return (
            <li
              key={s.step}
              className={`cf-step${active ? " is-active" : ""}`}
              style={{ flexGrow: Math.max(dur, 17000) }}
            >
              <span className="cf-step-bar" />
              <span className="cf-step-name">
                {i + 1}. {STEP_NAMES[s.step]}
              </span>
              <span className="cf-step-dur">
                {dur < 1000 ? "same tick" : `${(dur / 1000).toFixed(1)} s`}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="cf-replay-body">
        <ol className="cf-log" aria-live="polite">
          {visible.length === 0 && (
            <li className="cf-log-empty">
              Step 1 already built the list from last year’s return: 5
              documents, 3 confirmations. Press Play to watch the five uploads
              arrive.
            </li>
          )}
          {visible.map((f) =>
            f.kind === "read" ? (
              <li key={f.file} className="cf-log-line">
                <span className="cf-log-t">{fmt(f.ms)}</span>
                <span className="cf-log-actor">agent</span>
                <span className="cf-log-text">
                  Read <span className="cf-file">{f.file}</span>: {f.form},{" "}
                  {f.payer},{" "}
                  <span className={f.year !== 2026 ? "cf-hl" : undefined}>
                    tax year {f.year}
                  </span>
                </span>
              </li>
            ) : (
              <li key="rule" className="cf-log-line cf-log-rule">
                <span className="cf-log-t">{fmt(f.ms)}</span>
                <span className="cf-log-actor">rule</span>
                <span className="cf-log-text">
                  tax_year: {f.title}. It does not count toward the 2026 list.
                </span>
              </li>
            ),
          )}
        </ol>

        <div className="cf-mini">
          <p className="cf-mini-head">2026 list</p>
          <ul>
            {rows.expected.map((r) => {
              const st = rows.map.get(r.id)!;
              return (
                <li key={r.id} className={`cf-mini-row tone-${st.tone}`}>
                  <span className="cf-mini-id">{r.id}</span>
                  <span className="cf-mini-doc">
                    {r.form} <span>{r.payer}</span>
                  </span>
                  <span className="cf-mini-st">{st.label}</span>
                </li>
              );
            })}
            {rows.extra.map((r) => (
              <li key={r.key} className="cf-mini-row tone-new">
                <span className="cf-mini-id">+</span>
                <span className="cf-mini-doc">
                  {r.form} <span>{r.payer}</span>
                </span>
                <span className="cf-mini-st">{r.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="cf-replay-foot">
        Played at {SPEED}x from the recorded event log. Synthetic client (
        {trace.client.replace(" (synthetic client)", "")}), generated into real
        IRS forms. Step 4 then took 60.2 s to draft the client message and the
        preparer note, and stopped for approval.
      </p>
    </section>
  );
}
