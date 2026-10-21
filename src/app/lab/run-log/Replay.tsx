"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "./hooks";
import type { Run, Step } from "./types";

// "Pick an input": the visitor chooses one of three recorded runs and watches
// it play back step by step. The run stops at the approval step until the
// visitor presses Approve, like the real systems stop until a person signs.

const LETTERS = ["A", "B", "C", "D"];

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function fmtDur(s: number) {
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r ? `${m}m ${String(r).padStart(2, "0")}s` : `${m}m`;
}

function stepDelay(run: Run, i: number) {
  if (i === 0) return 550;
  const prev = run.steps[i - 1];
  const cur = run.steps[i];
  if (run.timing === "real" && cur.ms != null && prev.ms != null) {
    return Math.min(1800, Math.max(450, (cur.ms - prev.ms) / run.speed));
  }
  return 950;
}

/** Right-hand timing cell: the real duration when the run recorded one. */
function stepTiming(run: Run, i: number): string | null {
  const s = run.steps[i];
  if (s.dur != null) return fmtDur(s.dur);
  if (run.timing === "real" && s.ms != null && i > 0 && run.steps[i - 1].ms != null) {
    const d = (s.ms - (run.steps[i - 1].ms as number)) / 1000;
    return d < 0.05 ? "<0.1 s" : `${d.toFixed(1)} s`;
  }
  return null;
}

/** Left-hand cell: recorded wall clock, or the call number. */
function stepStamp(run: Run, s: Step, i: number) {
  if (s.clock) return s.clock;
  if (run.steps.some((x) => x.clock)) return "after";
  const n = run.steps.slice(0, i + 1).filter((x) => x.kind !== "approval").length;
  return `call ${String(n).padStart(2, "0")}`;
}

export default function Replay({ runs }: { runs: Run[] }) {
  const reduced = useReducedMotion();
  const [runIdx, setRunIdx] = useState(0);
  const [shown, setShown] = useState(0);
  const [approved, setApproved] = useState(false);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const run = runs[runIdx];
  const steps = run.steps;
  const apprIdx = steps.findIndex((s) => s.kind === "approval");
  const limit = approved || apprIdx < 0 ? steps.length : apprIdx + 1;
  const visible = reduced ? limit : Math.min(shown, limit);
  const finished = visible >= steps.length;
  const waiting = !finished && visible >= limit;
  const playing = !finished && !waiting && !paused && !reduced;

  // Start playing only once the player is on screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView) return;
    const id = window.setTimeout(() => {
      setShown(visible + 1);
      setOpenId(steps[visible].id);
    }, stepDelay(run, visible));
    return () => window.clearTimeout(id);
  }, [playing, inView, visible, run, steps]);

  function select(i: number) {
    setRunIdx(i);
    setShown(0);
    setApproved(false);
    setHeld(false);
    setPaused(false);
    setOpenId(null);
    setInView(true);
  }

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % runs.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + runs.length) % runs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = runs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  }

  function approve() {
    setApproved(true);
    setHeld(false);
    setPaused(false);
    setShown(apprIdx + 1);
  }

  const shownSteps = steps.slice(0, visible);
  const firedTitles = shownSteps.filter((s) => s.flag).map((s) => `${s.title} ${s.tool ?? ""}`);
  const nextStep = playing ? steps[visible] : null;
  const reachedApproval = apprIdx < 0 || visible > apprIdx;

  const auditVisible = run.result.audit.filter((a) => {
    if (a.after.endsWith("+")) return approved;
    const idx = steps.findIndex((s) => s.id === a.after);
    return idx >= 0 && idx < visible;
  });

  const status = finished ? "finished" : waiting ? "waiting for a person" : playing ? "replaying" : "paused";
  const statusClass = finished ? "is-done" : waiting || playing ? "is-live" : "is-paused";

  return (
    <div className="rl-replay" ref={rootRef}>
      <div className="rl-picker" role="tablist" aria-label="Pick an input">
        {runs.map((r, i) => (
          <button
            key={r.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`rl-tab-${r.id}`}
            aria-selected={i === runIdx}
            aria-controls="rl-sheet"
            tabIndex={i === runIdx ? 0 : -1}
            className="rl-pick"
            onClick={() => select(i)}
            onKeyDown={(e) => onTabKey(e, i)}
          >
            <span className="rl-pick-letter rl-mono">{LETTERS[i]}</span>
            <span className="rl-pick-body">
              <span className="rl-pick-title">{r.tab}</span>
              <span className="rl-pick-meta rl-mono">
                {r.tabMeta} · {fmtDate(r.recorded)}
              </span>
            </span>
          </button>
        ))}
      </div>

      <section
        className="rl-sheet"
        id="rl-sheet"
        role="tabpanel"
        aria-labelledby={`rl-tab-${run.id}`}
      >
        <header className="rl-sheet-head">
          <div className="rl-sheet-title">
            <span className="rl-sheet-system">{run.system}</span>
            <span className="rl-mono rl-sheet-sub">
              Replay of a recorded run, {fmtDate(run.recorded)}
              {run.timing === "real"
                ? ` · real timings, played at ${run.speed}x`
                : " · timings not recorded, paced for reading"}
            </span>
          </div>
          <div className="rl-sheet-controls">
            <span className={`rl-state ${statusClass}`} role="status">
              <i aria-hidden />
              {status}
            </span>
            {!finished && !waiting && !reduced && (
              <button className="rl-btn" onClick={() => setPaused((p) => !p)}>
                {paused ? "Play" : "Pause"}
              </button>
            )}
            {!finished && !waiting && (
              <button
                className="rl-btn"
                onClick={() => {
                  setShown(limit);
                  setOpenId(null);
                }}
              >
                Skip ahead
              </button>
            )}
            <button className="rl-btn" onClick={() => select(runIdx)}>
              Replay
            </button>
          </div>
        </header>

        <div className="rl-sheet-grid">
          {/* Input */}
          <div className="rl-col rl-input" data-open={inputOpen}>
            <button
              className="rl-input-toggle"
              aria-expanded={inputOpen}
              onClick={() => setInputOpen((o) => !o)}
            >
              <span className="rl-col-label rl-mono">Input</span>
              <span className="rl-input-toggle-title">{run.input.title}</span>
              <span className="rl-mono rl-input-toggle-hint">{inputOpen ? "Hide" : "Show"}</span>
            </button>
            <p className="rl-col-label rl-mono rl-desk-only">Input</p>
            <h3 className="rl-input-title rl-desk-only">{run.input.title}</h3>
            <div className="rl-input-body">
              <ul className="rl-files">
                {run.input.items.map((it) => {
                  const named = steps.some((s) => s.flag && `${s.title} ${s.tool ?? ""}`.includes(it.name));
                  const flagged = !!it.flag && (!named || firedTitles.some((t) => t.includes(it.name)));
                  return (
                    <li key={it.name} className={flagged ? "is-flagged" : ""}>
                      <span className="rl-file-name rl-mono">{it.name}</span>
                      <span className="rl-file-meta">{it.meta}</span>
                      {flagged && (
                        <span className="rl-flag rl-mono" aria-label="flagged">
                          !
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="rl-input-note">{run.input.note}</p>
              <p className="rl-synthetic">{run.synthetic}</p>
            </div>
          </div>

          {/* Steps */}
          <div className="rl-col rl-steps">
            <p className="rl-col-label rl-mono">
              Steps <span className="rl-count">{visible}/{steps.length}</span>
            </p>
            <ol className="rl-steplist">
              {shownSteps.map((s, i) =>
                s.kind === "approval" ? (
                  <li key={s.id} className={`rl-approval ${approved ? "is-approved" : "is-waiting"}`}>
                    <div className="rl-approval-head">
                      <span className="rl-actor rl-actor--human">human</span>
                      <span className="rl-approval-title">
                        {approved
                          ? s.recorded?.startsWith("Recorded:")
                            ? `Approved by ${s.who}, as recorded`
                            : `Approved by you, playing ${s.who}`
                          : s.title}
                      </span>
                    </div>
                    {!approved && (
                      <>
                        <p className="rl-approval-note">{s.recorded}</p>
                        <div className="rl-approval-actions">
                          <button className="rl-btn rl-btn--ink" onClick={approve}>
                            Approve as {s.who}
                          </button>
                          <button className="rl-btn" onClick={() => setHeld(true)} disabled={held}>
                            Hold
                          </button>
                          <span className="rl-approval-role">{s.role}</span>
                        </div>
                        {held && (
                          <p className="rl-held rl-mono" role="status">
                            Held. Nothing was sent, nothing moved. The proposal stays pending.
                          </p>
                        )}
                      </>
                    )}
                  </li>
                ) : (
                  <li
                    key={s.id}
                    className={`rl-step ${openId === s.id ? "is-open" : ""} ${s.flag ? `is-${s.flag}` : ""}`}
                  >
                    <button
                      className="rl-step-row"
                      aria-expanded={openId === s.id}
                      onClick={() => setOpenId(openId === s.id ? null : s.id)}
                    >
                      <span className="rl-step-stamp rl-mono">{stepStamp(run, s, i)}</span>
                      <span className={`rl-actor rl-actor--${s.actor}`}>{s.actor}</span>
                      <span className="rl-step-title">
                        {s.flag && <span className="rl-flag rl-mono" aria-label={s.flag === "block" ? "blocked" : "flagged"}>{s.flag === "block" ? "×" : "!"}</span>}
                        {s.title}
                      </span>
                      <span className="rl-step-time rl-mono">{stepTiming(run, i)}</span>
                    </button>
                    <div className="rl-step-detail">
                      <div>
                        {s.tool && <code className="rl-tool">{s.tool}</code>}
                        {s.detail?.map((d, j) => (
                          <p key={j}>{d}</p>
                        ))}
                      </div>
                    </div>
                  </li>
                ),
              )}
              {nextStep && (
                <li className="rl-step rl-step--ghost" aria-hidden>
                  <span className="rl-live-dot" />
                  <span className="rl-mono">
                    {nextStep.kind === "approval" ? "handing over to a person" : `running ${nextStep.tool?.split(" ")[0] ?? nextStep.actor}`}
                  </span>
                </li>
              )}
              {visible === 0 && !nextStep && (
                <li className="rl-step rl-step--ghost">
                  <span className="rl-mono">Press Replay to start.</span>
                </li>
              )}
            </ol>
          </div>

          {/* Result */}
          <div className="rl-col rl-result" aria-live="polite">
            <p className="rl-col-label rl-mono">Result</p>
            {!reachedApproval ? (
              <p className="rl-result-empty">The result lands here when the run reaches its approval step.</p>
            ) : (
              <div className="rl-result-body">
                <dl className="rl-ledger">
                  {run.result.stats.map((st) => (
                    <div key={st.label}>
                      <dt>{st.label}</dt>
                      <dd>
                        <span className="rl-ledger-value">{st.value}</span>
                        <span className="rl-ledger-note">{st.note}</span>
                      </dd>
                    </div>
                  ))}
                </dl>

                {run.result.findings.length > 0 && (
                  <div className="rl-findings">
                    {(["client", "preparer"] as const).map((route) => (
                      <div key={route}>
                        <p className="rl-mono rl-findings-head">
                          To the {route} · {run.result.findings.filter((f) => f.route === route).length}
                        </p>
                        <ul>
                          {run.result.findings
                            .filter((f) => f.route === route)
                            .map((f) => (
                              <li key={f.title}>{f.title}</li>
                            ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {run.result.message && approved && (
                  <details className="rl-letter">
                    <summary>
                      <span className="rl-mono">Approved message</span>
                      <span className="rl-letter-subject">{run.result.message.subject}</span>
                    </summary>
                    <p className="rl-letter-body">{run.result.message.body}</p>
                  </details>
                )}

                {finished && (
                  <p className="rl-outcome">
                    <span className="rl-mono">Outcome</span>
                    {run.result.outcome}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="rl-audit">
          <p className="rl-col-label rl-mono">audit.log</p>
          <ol>
            {auditVisible.length === 0 && <li className="rl-audit-empty rl-mono">no entries yet</li>}
            {auditVisible.map((a, i) => (
              <li key={`${a.clock}-${i}`} className="rl-mono">
                <span className="rl-audit-clock">{a.clock}</span>
                <span className={`rl-actor rl-actor--${a.actor}`}>{a.actor}</span>
                <span className="rl-audit-text">{a.text}</span>
              </li>
            ))}
          </ol>
          <p className="rl-source rl-mono">
            Source: {run.source} · {run.model}
          </p>
        </div>
      </section>
    </div>
  );
}
