"use client";

import { useBelgradeTime } from "./hooks";

export default function Clock() {
  const t = useBelgradeTime();
  return (
    <span className="rl-clock" aria-label={`Local time in Belgrade ${t}`}>
      <span className="rl-mono">{t}</span> Belgrade
    </span>
  );
}
