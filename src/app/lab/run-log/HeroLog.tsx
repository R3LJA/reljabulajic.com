"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "./hooks";

export type LogLine = { clock: string; actor: string; text: string; gap: number; live?: boolean };

// The hero's run log: lines from a recorded run tick in at 10x their real
// pace, hold, then the run starts again. With reduced motion, all lines show.
export default function HeroLog({ lines, recorded }: { lines: LogLine[]; recorded: string }) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (reduced) return;
    const done = count >= lines.length;
    const wait = done ? 5200 : Math.min(1700, Math.max(420, lines[count].gap / 10));
    const id = window.setTimeout(() => setCount(done ? 1 : count + 1), wait);
    return () => window.clearTimeout(id);
  }, [count, lines, reduced]);

  const shown = reduced ? lines.length : count;
  const finished = shown >= lines.length;

  return (
    <figure className="rl-herolog" aria-label="Run log, replay of a recorded run">
      <figcaption className="rl-herolog-head">
        <span className="rl-mono">intake-agent / kessler</span>
        <span className={`rl-state ${finished ? "is-hold" : "is-live"}`}>
          <i aria-hidden />
          {finished ? "waiting for a person" : "replaying"}
        </span>
      </figcaption>
      <ol className="rl-herolog-lines" aria-live="off">
        {lines.slice(0, shown).map((l, i) => (
          <li key={`${i}-${l.clock}`} className={`${l.live ? "is-live" : ""} ${i === shown - 1 ? "is-new" : ""}`}>
            <time className="rl-mono">{l.clock}</time>
            <span className={`rl-actor rl-actor--${l.actor}`}>{l.actor}</span>
            <span className="rl-herolog-text">{l.text}</span>
          </li>
        ))}
      </ol>
      <p className="rl-herolog-foot rl-mono">
        Replay of a recorded run, {recorded}. Played at 10x. Synthetic client.
      </p>
    </figure>
  );
}
