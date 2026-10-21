"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./hooks";

// Placeholder for the founder video: a short muted loop, poster first.
// With reduced motion it stays on the poster frame.
export default function VideoCard() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced) v.pause();
    else v.play().catch(() => {});
  }, [reduced]);

  return (
    <figure className="rl-video">
      <div className="rl-video-frame">
        <video
          ref={ref}
          src="/videos/founder-loop.mp4"
          poster="/videos/founder-loop.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Relja at his desk, a short muted loop"
        />
        <span className="rl-video-tag rl-mono">Intro video, recording soon</span>
      </div>
      <figcaption>
        <span>Relja Bulajić</span>
        <span className="rl-mono">Belgrade, Serbia · CET</span>
      </figcaption>
    </figure>
  );
}
