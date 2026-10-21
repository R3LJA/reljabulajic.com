"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import traces from "./traces.json";

// ---------------------------------------------------------------- types

type Status = "ok" | "pending" | "blocked" | "done" | "pass" | "fail";

type Step = {
  node: string;
  title: string;
  input: string;
  output: string;
  status: string;
  note: string;
  meta?: string;
};

type SystemTrace = {
  id: string;
  key: string;
  name: string;
  short: string;
  summary: string;
  recorded: string;
  context: string;
  source: { label: string; href: string } | null;
  nodes: { id: string; label: string; kind: string }[];
  steps: Step[];
};

export type LiveApp = {
  slug: string;
  name: string;
  tagline: string;
  detail: string;
  platforms: string;
  appStoreUrl: string;
  iconUrl: string | null;
};

type Mode = "systems" | "apps" | "me";

const SYSTEMS = traces.systems as SystemTrace[];

const MODES: { id: Mode; label: string; key: string; hint: string }[] = [
  { id: "systems", label: "Systems", key: "1", hint: "Recorded agent runs" },
  { id: "apps", label: "Apps", key: "2", hint: "Live on the App Store" },
  { id: "me", label: "Me", key: "3", hint: "Who you would hire" },
];

const STATUS_LABEL: Record<Status, string> = {
  ok: "OK",
  pending: "Pending approval",
  blocked: "Blocked",
  done: "Executed",
  pass: "Pass",
  fail: "Fail",
};

const DEV_PAGE = "https://apps.apple.com/md/developer/relja-bulajic/id1801518678";

const pad = (n: number) => String(n).padStart(2, "0");

// ---------------------------------------------------------------- clock

const subscribeSecond = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const nowSecond = () => Math.floor(Date.now() / 1000);
const serverSecond = () => 0;

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Belgrade",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});
const offsetFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Belgrade",
  timeZoneName: "shortOffset",
});

function useBelgradeClock() {
  const s = useSyncExternalStore(subscribeSecond, nowSecond, serverSecond);
  if (!s) return { time: "--:--:--", offset: "GMT+1" };
  const d = new Date(s * 1000);
  const offset = offsetFmt.formatToParts(d).find((p) => p.type === "timeZoneName")?.value ?? "";
  return { time: timeFmt.format(d), offset };
}

// ---------------------------------------------------------------- dial

function Dial({
  count,
  value,
  onChange,
  label,
  valueText,
  size = "lg",
}: {
  count: number;
  value: number;
  onChange: (i: number) => void;
  label: string;
  valueText: string;
  size?: "lg" | "sm";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const SWEEP = 270;
  const START = -135;
  const angleFor = (i: number) => (count <= 1 ? 0 : START + (SWEEP * i) / (count - 1));

  const fromPointer = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    let a = (Math.atan2(dx, -dy) * 180) / Math.PI;
    a = Math.max(START, Math.min(START + SWEEP, a));
    const i = Math.round(((a - START) / SWEEP) * (count - 1));
    if (i !== value) onChange(i);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = value;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(count - 1, value + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(0, value - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else return;
    e.preventDefault();
    if (next !== value) onChange(next);
  };

  return (
    <div
      ref={ref}
      className={`ins-dial ins-dial--${size}`}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={count}
      aria-valuenow={value + 1}
      aria-valuetext={valueText}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        fromPointer(e);
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <svg className="ins-dial-ticks" viewBox="0 0 100 100" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => {
          const a = ((angleFor(i) - 90) * Math.PI) / 180;
          const r1 = 46;
          const r2 = i === value ? 40 : 42.5;
          return (
            <line
              key={i}
              x1={50 + r1 * Math.cos(a)}
              y1={50 + r1 * Math.sin(a)}
              x2={50 + r2 * Math.cos(a)}
              y2={50 + r2 * Math.sin(a)}
              data-state={i === value ? "current" : i < value ? "past" : "future"}
            />
          );
        })}
      </svg>
      <div className="ins-knob" style={{ transform: `rotate(${angleFor(value)}deg)` }}>
        <span className="ins-knob-mark" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- small parts

function StatusChip({ status }: { status: string }) {
  const s = (status in STATUS_LABEL ? status : "ok") as Status;
  return (
    <span className="ins-chip" data-status={s}>
      {STATUS_LABEL[s]}
    </span>
  );
}

function AppIcon({ app, size }: { app: LiveApp; size: number }) {
  if (!app.iconUrl) {
    return (
      <span className="ins-appicon ins-appicon--letter" style={{ width: size, height: size }} aria-hidden="true">
        {app.name[0]}
      </span>
    );
  }
  return (
    <Image
      className="ins-appicon"
      src={app.iconUrl}
      alt=""
      width={size}
      height={size}
      unoptimized
    />
  );
}

// ---------------------------------------------------------------- systems

const clampFor = (sysIdx: number, i: number) =>
  Math.max(0, Math.min(SYSTEMS[sysIdx].steps.length - 1, i));

function useSystemState() {
  const [st, setSt] = useState({ sys: 0, step: 0 });
  const sys = SYSTEMS[st.sys];
  const step = Math.min(st.step, sys.steps.length - 1);
  const setStep = useCallback((i: number) => setSt((s) => ({ ...s, step: clampFor(s.sys, i) })), []);
  const stepBy = useCallback((d: number) => setSt((s) => ({ ...s, step: clampFor(s.sys, s.step + d) })), []);
  const selectSystem = useCallback((i: number) => setSt({ sys: i, step: 0 }), []);
  return { sys, sysIdx: st.sys, step, setStep, stepBy, selectSystem };
}

function SystemsDisplay({
  sys,
  step,
  setStep,
}: {
  sys: SystemTrace;
  step: number;
  setStep: (i: number) => void;
}) {
  const cur = sys.steps[step];
  const visited = new Set(sys.steps.slice(0, step + 1).map((s) => s.node));

  const clickNode = (id: string) => {
    const after = sys.steps.findIndex((s, i) => i > step && s.node === id);
    const first = sys.steps.findIndex((s) => s.node === id);
    const target = after >= 0 && (cur.node === id || after === step + 1) ? after : first;
    if (target >= 0) setStep(target);
  };

  return (
    <div className="ins-sys">
      <header className="ins-dhead">
        <div className="ins-dhead-l">
          <span className="ins-dkey">{sys.key}</span>
          <h2 className="ins-dtitle">{sys.name}</h2>
        </div>
        <p className="ins-replay">
          Replay of a recorded run · <time>{sys.recorded}</time>
        </p>
      </header>
      <p className="ins-summary">{sys.summary}</p>

      <ol className="ins-graph" style={{ ["--n" as string]: sys.nodes.length }}>
        {sys.nodes.map((n, i) => {
          const state = n.id === cur.node ? "current" : visited.has(n.id) ? "visited" : "todo";
          const prevVisited = i > 0 && visited.has(sys.nodes[i - 1].id) && visited.has(n.id);
          return (
            <li key={n.id} data-state={state} data-link={i === 0 ? "none" : prevVisited ? "on" : "off"}>
              <button
                type="button"
                className="ins-node"
                onClick={() => clickNode(n.id)}
                aria-current={state === "current" ? "step" : undefined}
                aria-label={`${n.label}, ${n.kind}`}
              >
                <span className="ins-node-top">
                  <span className="ins-node-idx">{pad(i + 1)}</span>
                  <span className="ins-led" aria-hidden="true" />
                </span>
                <span className="ins-node-label">{n.label}</span>
                <span className="ins-node-kind">{n.kind}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="ins-stepbar">
        <span className="ins-readout" aria-live="polite">
          <span className="ins-readout-big">{pad(step + 1)}</span>
          <span className="ins-readout-of">/{pad(sys.steps.length)}</span>
        </span>
        <span className="ins-steptitle">{cur.title}</span>
        <StatusChip status={cur.status} />
        {cur.meta ? <span className="ins-meta">{cur.meta}</span> : null}
      </div>

      <div className="ins-io" key={`${sys.id}-${step}`}>
        <div className="ins-io-col">
          <span className="ins-io-label">Input</span>
          <pre className="ins-pre">{cur.input}</pre>
        </div>
        <div className="ins-io-col ins-io-col--out">
          <span className="ins-io-label">
            Output <span className="ins-io-run" aria-hidden="true" />
          </span>
          <pre className="ins-pre ins-pre--out" data-status={cur.status}>
            {cur.output}
          </pre>
        </div>
      </div>
      <p className="ins-note">{cur.note}</p>
      <p className="ins-context">{sys.context}</p>
    </div>
  );
}

function SystemsControls({
  sysIdx,
  selectSystem,
  sys,
  step,
  setStep,
  compact,
}: {
  sysIdx: number;
  selectSystem: (i: number) => void;
  sys: SystemTrace;
  step: number;
  setStep: (i: number) => void;
  compact: boolean;
}) {
  const last = sys.steps.length - 1;
  return (
    <div className="ins-ctl">
      <div className="ins-ctl-group">
        <span className="ins-ctl-label">System</span>
        <div className="ins-selector" role="radiogroup" aria-label="Choose a system">
          {SYSTEMS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={i === sysIdx}
              className="ins-sel"
              onClick={() => selectSystem(i)}
            >
              <span className="ins-led" aria-hidden="true" />
              <span className="ins-sel-key">{s.key}</span>
              <span className="ins-sel-text">
                <span className="ins-sel-name">{s.name}</span>
                <span className="ins-sel-short">{s.short}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="ins-ctl-group ins-ctl-group--dial">
        <span className="ins-ctl-label">Step</span>
        <div className="ins-dialrow">
          <button
            type="button"
            className="ins-btn ins-btn--sq"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            aria-label="Previous step"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
          </button>
          <Dial
            count={sys.steps.length}
            value={step}
            onChange={setStep}
            label="Step through the recorded run"
            valueText={`Step ${step + 1} of ${sys.steps.length}: ${sys.steps[step].title}`}
            size={compact ? "sm" : "lg"}
          />
          <button
            type="button"
            className="ins-btn ins-btn--sq"
            onClick={() => setStep(step === last ? 0 : step + 1)}
            aria-label={step === last ? "Replay from the start" : "Run next step"}
          >
            {step === last ? (
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3M3.5 2.5v2.4h2.4" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
            )}
          </button>
        </div>
        <button
          type="button"
          className="ins-btn ins-btn--run"
          onClick={() => setStep(step === last ? 0 : step + 1)}
        >
          {step === last ? "Replay from step 01" : `Run step ${pad(step + 2)}`}
          <kbd>→</kbd>
        </button>
      </div>

      <div className="ins-ctl-foot">
        {sys.source ? (
          <a className="ins-link" href={sys.source.href} target="_blank" rel="noreferrer">
            {sys.source.label} <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="ins-muted">Private repo. Demo is unlisted.</span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- apps

function AppsDisplay({ apps, idx, setIdx }: { apps: LiveApp[]; idx: number; setIdx: (i: number) => void }) {
  const app = apps[idx];
  return (
    <div className="ins-apps">
      <div className="ins-phone-wrap">
        <div className="ins-phone" aria-roledescription="carousel" aria-label="App screens">
          <div className="ins-phone-screen">
            <div className="ins-track" style={{ transform: `translate3d(${-idx * 100}%,0,0)` }}>
              {apps.map((a, i) => (
                <div className="ins-slide" key={a.slug} aria-hidden={i !== idx}>
                  <Image
                    src={`/apps/${a.slug}/screenshots/01.png`}
                    alt={`${a.name} home screen`}
                    width={920}
                    height={2000}
                    sizes="240px"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
            <span className="ins-island" aria-hidden="true" />
          </div>
        </div>
        <div className="ins-dots" aria-hidden="true">
          {apps.map((a, i) => (
            <span key={a.slug} data-on={i === idx} />
          ))}
        </div>
      </div>

      <div className="ins-appinfo" key={app.slug}>
        <span className="ins-readout">
          <span className="ins-readout-big">{pad(idx + 1)}</span>
          <span className="ins-readout-of">/{pad(apps.length)}</span>
        </span>
        <div className="ins-appinfo-head">
          <AppIcon app={app} size={64} />
          <div>
            <h2 className="ins-appname">{app.name}</h2>
            <p className="ins-appplat">{app.platforms}</p>
          </div>
        </div>
        <p className="ins-apptag">{app.tagline}</p>
        <p className="ins-appdetail">{app.detail}</p>
        <div className="ins-appnav">
          <a className="ins-btn ins-btn--store" href={app.appStoreUrl} target="_blank" rel="noreferrer">
            View on the App Store <span aria-hidden="true">↗</span>
          </a>
          <div className="ins-appnav-arrows">
            <button
              type="button"
              className="ins-btn ins-btn--sq"
              aria-label="Previous app"
              onClick={() => setIdx((idx - 1 + apps.length) % apps.length)}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
            </button>
            <button
              type="button"
              className="ins-btn ins-btn--sq"
              aria-label="Next app"
              onClick={() => setIdx((idx + 1) % apps.length)}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
            </button>
          </div>
        </div>
        <p className="ins-context">Real screens from the shipped builds. Designed, built and published solo.</p>
      </div>
    </div>
  );
}

function AppsControls({
  apps,
  idx,
  setIdx,
  compact,
}: {
  apps: LiveApp[];
  idx: number;
  setIdx: (i: number) => void;
  compact: boolean;
}) {
  return (
    <div className="ins-ctl">
      <div className="ins-ctl-group">
        <span className="ins-ctl-label">App</span>
        <div className="ins-selector ins-selector--apps" role="radiogroup" aria-label="Choose an app">
          {apps.map((a, i) => (
            <button
              key={a.slug}
              type="button"
              role="radio"
              aria-checked={i === idx}
              className="ins-sel ins-sel--app"
              onClick={() => setIdx(i)}
            >
              <span className="ins-led" aria-hidden="true" />
              <AppIcon app={a} size={26} />
              <span className="ins-sel-name">{a.name}</span>
            </button>
          ))}
        </div>
      </div>
      {!compact && (
        <div className="ins-ctl-group ins-ctl-group--dial">
          <span className="ins-ctl-label">Scroll</span>
          <div className="ins-dialrow ins-dialrow--solo">
            <Dial
              count={apps.length}
              value={idx}
              onChange={setIdx}
              label="Choose an app"
              valueText={`${apps[idx].name}, ${idx + 1} of ${apps.length}`}
            />
          </div>
        </div>
      )}
      <div className="ins-ctl-foot">
        <a className="ins-link" href={DEV_PAGE} target="_blank" rel="noreferrer">
          All 10 apps on my developer page <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- me

const FACTS: { k: string; v: string }[] = [
  { k: "Base", v: "Belgrade, Serbia. One person, no agency. Your New York morning is my afternoon." },
  { k: "Record", v: "Top Rated on Upwork, 100% Job Success across 14 jobs." },
  { k: "Shipped", v: "10 iOS apps live on the App Store under my own name." },
  { k: "Open source", v: "Gatehouse MCP: 72 tests, 13 of 13 red-team attacks blocked." },
];

function MeDisplay() {
  const vid = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) vid.current?.pause();
  }, []);
  return (
    <div className="ins-me">
      <figure className="ins-video">
        <video
          ref={vid}
          src="/videos/founder-loop.mp4"
          poster="/videos/founder-loop.jpg"
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
          aria-label="Relja at his desk, muted loop"
        />
        <figcaption>
          <span className="ins-rec" aria-hidden="true" />
          Intro video, recording soon
        </figcaption>
      </figure>
      <div className="ins-facts">
        <h2 className="ins-dtitle">Relja Bulajić</h2>
        <dl>
          {FACTS.map((f) => (
            <div className="ins-fact" key={f.k}>
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

const ZONES = [
  { city: "San Francisco", tz: "America/Los_Angeles" },
  { city: "New York", tz: "America/New_York" },
  { city: "London", tz: "Europe/London" },
  { city: "Belgrade", tz: "Europe/Belgrade" },
].map((z) => ({
  ...z,
  fmt: new Intl.DateTimeFormat("en-GB", { timeZone: z.tz, hour: "2-digit", minute: "2-digit", hour12: false }),
}));

function MeControls({ upworkUrl }: { upworkUrl: string }) {
  const s = useSyncExternalStore(subscribeSecond, nowSecond, serverSecond);
  return (
    <div className="ins-ctl ins-ctl--close">
      <div className="ins-ctl-group">
        <span className="ins-ctl-label">Clocks</span>
        <ul className="ins-zones">
          {ZONES.map((z) => (
            <li key={z.city} data-home={z.tz === "Europe/Belgrade" || undefined}>
              <span>{z.city}</span>
              <span className="ins-zone-time">{s ? z.fmt.format(new Date(s * 1000)) : "--:--"}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="ins-ctl-group ins-ctl-group--close">
        <span className="ins-ctl-label">Next step</span>
        <p className="ins-close">Reply to my proposal on Upwork.</p>
        <p className="ins-close-sub">
          You found this page through it. Tell me what your agent has to touch, and I will tell you where the
          gates go.
        </p>
        <a className="ins-btn ins-btn--run ins-btn--lit" href={upworkUrl} target="_blank" rel="noreferrer">
          My Upwork profile <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- root

export default function Instrument({ apps, upworkUrl }: { apps: LiveApp[]; upworkUrl: string }) {
  const [mode, setMode] = useState<Mode>("systems");
  const [pressed, setPressed] = useState<Mode | null>(null);
  const { sys, sysIdx, step, setStep, stepBy, selectSystem } = useSystemState();
  const [appIdx, setAppIdxRaw] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const clock = useBelgradeClock();
  const stageRef = useRef<HTMLDivElement>(null);

  const setAppIdx = useCallback((i: number) => {
    setAutoplay(false);
    setAppIdxRaw(i);
  }, []);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setPressed(m);
    window.setTimeout(() => setPressed(null), 140);
  }, []);

  // Apps cycle on their own until the visitor touches a control.
  useEffect(() => {
    if (mode !== "apps" || !autoplay) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setAppIdxRaw((i) => (i + 1) % apps.length), 4200);
    return () => window.clearInterval(id);
  }, [mode, autoplay, apps.length]);

  // Keyboard: 1 2 3 switch modes, arrows step the current mode.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const m = MODES.find((x) => x.key === e.key);
      if (m) {
        switchMode(m.id);
        return;
      }
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const dir = e.key === "ArrowRight" ? 1 : -1;
      if (mode === "systems") {
        e.preventDefault();
        stepBy(dir);
      } else if (mode === "apps") {
        e.preventDefault();
        setAutoplay(false);
        setAppIdxRaw((i) => (i + dir + apps.length) % apps.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, stepBy, apps.length, switchMode]);

  const modeIdx = MODES.findIndex((m) => m.id === mode);

  return (
    <div className="ins-page">
      <main className="ins-panel" data-mode={mode}>
        <header className="ins-strip">
          <div className="ins-strip-id">
            <span className="ins-name">Relja Bulajić</span>
            <span className="ins-role">Forward deployed AI engineer · iOS</span>
          </div>
          <p className="ins-strip-status">
            <span className="ins-muted">Replays</span> 3 recorded runs
            <span className="ins-sep" aria-hidden="true" />
            <span className="ins-muted">Latest</span> 13 Oct 2026
          </p>
          <p className="ins-strip-clock" aria-label={`Belgrade local time ${clock.time}`}>
            <span className="ins-muted">Belgrade</span>
            <span className="ins-clock">{clock.time}</span>
            <span className="ins-muted">{clock.offset}</span>
          </p>
        </header>

        <section className="ins-plate">
          <h1 className="ins-h1">
            I build AI agents that touch real money and real customers, and the part after the demo.
          </h1>
          <p className="ins-lede">
            Approval gates, audit trails, evals and cost limits, proven on recorded runs below. Plus iOS apps I
            ship alone.
          </p>
        </section>

        <div className="ins-deck">
          <div className="ins-screen" ref={stageRef}>
            <div className="ins-screen-inner" key={mode}>
              {mode === "systems" && <SystemsDisplay sys={sys} step={step} setStep={setStep} />}
              {mode === "apps" && <AppsDisplay apps={apps} idx={appIdx} setIdx={setAppIdx} />}
              {mode === "me" && <MeDisplay />}
            </div>
          </div>
          <aside className="ins-side" aria-label="Controls">
            <div className="ins-side-inner" key={mode}>
              {mode === "systems" && (
                <SystemsControls
                  sysIdx={sysIdx}
                  selectSystem={selectSystem}
                  sys={sys}
                  step={step}
                  setStep={setStep}
                  compact={false}
                />
              )}
              {mode === "apps" && <AppsControls apps={apps} idx={appIdx} setIdx={setAppIdx} compact={false} />}
              {mode === "me" && <MeControls upworkUrl={upworkUrl} />}
            </div>
          </aside>
        </div>

        <footer className="ins-keybed">
          {mode === "systems" && (
            <div className="ins-mstep">
              <button
                type="button"
                className="ins-btn ins-btn--sq"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                aria-label="Previous step"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
              </button>
              <button
                type="button"
                className="ins-btn ins-btn--run ins-btn--lit"
                onClick={() => {
                  setStep(step === sys.steps.length - 1 ? 0 : step + 1);
                  // On phones, bring the step readout into view so the output is seen.
                  requestAnimationFrame(() => {
                    const bar = stageRef.current?.querySelector(".ins-stepbar");
                    if (bar && bar.getBoundingClientRect().top > window.innerHeight * 0.45) {
                      bar.scrollIntoView({ block: "start", behavior: "smooth" });
                    }
                  });
                }}
              >
                {step === sys.steps.length - 1 ? "Replay from step 01" : `Run step ${pad(step + 2)} of ${pad(sys.steps.length)}`}
              </button>
            </div>
          )}
          <span className="ins-rev">Rev. 2026.10.19</span>
          <nav className="ins-keys" aria-label="Modes" style={{ ["--i" as string]: modeIdx }}>
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                className="ins-key"
                aria-pressed={mode === m.id}
                data-down={pressed === m.id || undefined}
                onClick={() => switchMode(m.id)}
              >
                <span className="ins-key-top">
                  <span className="ins-led" aria-hidden="true" />
                  <kbd className="ins-key-num">{m.key}</kbd>
                </span>
                <span className="ins-key-label">{m.label}</span>
                <span className="ins-key-hint">{m.hint}</span>
              </button>
            ))}
          </nav>
          <span className="ins-help" aria-hidden="true">
            <kbd>1</kbd>
            <kbd>2</kbd>
            <kbd>3</kbd> modes <kbd>←</kbd>
            <kbd>→</kbd> step
          </span>
        </footer>
      </main>
    </div>
  );
}
