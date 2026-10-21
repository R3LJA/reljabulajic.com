"use client";

import { useEffect, useRef, useState } from "react";

// The cover slot for Relja's 45-60 s founder video. Until it is recorded, the
// existing desk loop stands in, cropped to 9:16, muted, and clearly labelled.
export default function CoverVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    v.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="cf-video">
      <video
        ref={ref}
        src="/videos/founder-loop.mp4"
        poster="/videos/founder-loop.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Placeholder loop of Relja at his desk. Intro video, recording soon."
      />
      <span className="cf-video-label">Intro video, recording soon</span>
      <button
        type="button"
        className="cf-video-toggle"
        onClick={toggle}
        aria-pressed={playing}
      >
        {playing ? "Pause loop" : "Play loop"}
      </button>
    </div>
  );
}
