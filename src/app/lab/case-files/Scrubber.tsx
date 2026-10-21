"use client";

import { useCallback, useRef, useState } from "react";

// Before/after scrubber. Both panels sit in the same grid cell; the "after"
// panel is a sheet pulled over the "before" desk, its left edge at `pos`. Drag anywhere on the frame,
// or focus the handle and use the arrow keys (Shift for bigger steps, Home and
// End for the ends). Keyboard and button moves spring; dragging follows the
// pointer directly.
const SPLIT = 52;

export default function Scrubber({
  before,
  after,
}: {
  before: React.ReactNode;
  after: React.ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(SPLIT);
  const [dragging, setDragging] = useState(false);

  const fromClientX = useCallback((x: number) => {
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    setDragging(true);
    fromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) fromClientX(e.clientX);
  };
  const end = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 20 : 5;
    let next: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = pos - step;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = pos + step;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = 100;
    if (next === null) return;
    e.preventDefault();
    setPos(Math.min(100, Math.max(0, next)));
  };

  const rounded = Math.round(pos);

  return (
    <div className="cf-scrub">
      <div
        ref={frame}
        className={`cf-scrub-frame${dragging ? " is-dragging" : ""}`}
        style={{ "--pos": `${pos}%` } as React.CSSProperties}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <div
          className="cf-scrub-layer cf-scrub-before"
          aria-hidden={rounded >= 100}
        >
          {before}
        </div>
        <div
          className="cf-scrub-layer cf-scrub-after"
          aria-hidden={rounded <= 0}
        >
          {after}
        </div>
        <div
          className="cf-scrub-handle"
          role="slider"
          tabIndex={0}
          aria-label="Compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={rounded}
          aria-valuetext={
            rounded >= 100
              ? "Before only"
              : rounded <= 0
                ? "After only"
                : `Checklist pulled ${100 - rounded}% over the uploads`
          }
          onKeyDown={onKeyDown}
        >
          <span className="cf-scrub-grip" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" />
            </svg>
          </span>
        </div>
      </div>
      <div className="cf-scrub-buttons">
        <button
          type="button"
          onClick={() => setPos(100)}
          aria-pressed={rounded === 100}
        >
          Before
        </button>
        <button
          type="button"
          onClick={() => setPos(SPLIT)}
          aria-pressed={rounded === SPLIT}
        >
          Split
        </button>
        <button
          type="button"
          onClick={() => setPos(0)}
          aria-pressed={rounded === 0}
        >
          After
        </button>
      </div>
    </div>
  );
}
