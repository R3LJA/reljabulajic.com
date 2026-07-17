"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useThemeMode } from "@/lib/useThemeMode";

/**
 * Site-wide cursor-reactive generative flow field: particles drifting along
 * a time-varying vector field, leaving silky trails. Mounted once in the root
 * layout as a fixed layer, so it flows continuously across scrolling AND page
 * navigations. On the home page it burns at full strength in the hero and
 * settles to a calm ambience below the fold; on other pages it stays ambient.
 * Fully procedural, theme-tuned, honors prefers-reduced-motion.
 */

type Particle = {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  color: number; // palette index
  aSeed: number; // 0..1 → per-particle alpha within theme range
  wSeed: number; // 0..1 → per-particle stroke width
};

/* per-theme rendering recipe: light is denser ink, shorter cleaner trails */
const THEMES = {
  /* fade ≥ ~0.1 matters beyond trail length: 8-bit alpha rounding stalls
     the multiplicative fade at ~0.5/fade, so lower values leave permanent
     residue that slowly mats the whole screen */
  dark: {
    colors: ["200,182,155", "125,184,232", "167,139,250"],
    fade: 0.11,
    alphaBase: 0.11,
    alphaVar: 0.16,
  },
  light: {
    colors: ["116,93,62", "40,100,160", "97,72,182"],
    fade: 0.105,
    alphaBase: 0.3,
    alphaVar: 0.3,
  },
} as const;

/* weighted palette pick: mostly champagne/bronze */
function pickColor(r: number) {
  return r < 0.82 ? 0 : r < 0.93 ? 1 : 2;
}

/* organic pseudo-curl: layered sines, wraps smoothly in space and time */
function flowAngle(x: number, y: number, t: number) {
  const s = 0.0016;
  return (
    (Math.sin(x * s + t * 0.26) +
      Math.cos(y * s * 1.35 - t * 0.2) +
      Math.sin((x + y) * s * 0.6 + t * 0.12) * 0.8) *
    1.5
  );
}

/* field presence: hero full-strength, ambient elsewhere */
const REST = 0.3; // settled strength below the home fold
const AMBIENT = 0.5; // constant strength on non-home pages

export default function FlowField() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const redrawStaticRef = useRef<(() => void) | null>(null);

  const mode = useThemeMode();
  const modeRef = useRef<"dark" | "light">(mode);
  modeRef.current = mode;

  const pathname = usePathname();
  const isHomeRef = useRef(pathname === "/");
  isHomeRef.current = pathname === "/";

  /* reduced motion renders a static constellation; refresh it on theme flip */
  useEffect(() => {
    redrawStaticRef.current?.();
  }, [mode]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let last = 0;
    let presence = 1;
    let seed = 1;
    const rand = () => {
      /* deterministic LCG so re-seeds are stable */
      seed = (seed * 48271) % 2147483647;
      return seed / 2147483647;
    };
    const pointer = { x: 0, y: 0, active: false };

    function reseed() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(400, Math.max(110, Math.round((w * h) / 4300)));
      particles = Array.from({ length: count }, () => {
        const x = rand() * w;
        const y = rand() * h;
        return {
          x,
          y,
          px: x,
          py: y,
          vx: 0,
          vy: 0,
          color: pickColor(rand()),
          aSeed: rand(),
          wSeed: rand(),
        };
      });
    }

    function drawStatic() {
      const theme = THEMES[modeRef.current];
      ctx!.clearRect(0, 0, w, h);
      for (const p of particles) {
        const alpha = (theme.alphaBase + p.aSeed * theme.alphaVar) * 0.8;
        ctx!.fillStyle = `rgba(${theme.colors[p.color]},${alpha})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 0.8 + p.wSeed, 0, Math.PI * 2);
        ctx!.fill();
      }
    }
    redrawStaticRef.current = reduced ? drawStatic : null;

    function frame(now: number) {
      const dt = Math.min(2.5, Math.max(0.5, (now - last) / 16.667));
      last = now;
      const t = now / 1000;
      const theme = THEMES[modeRef.current];

      /* presence: eased scroll-linked strength, continuous across pages */
      const target = isHomeRef.current
        ? 1 -
          (1 - REST) *
            Math.min(1, window.scrollY / (window.innerHeight * 0.9))
        : AMBIENT;
      presence += (target - presence) * Math.min(1, 0.06 * dt);
      wrapper!.style.opacity = presence.toFixed(3);

      /* fade previous frame → trails, canvas stays transparent */
      ctx!.globalCompositeOperation = "destination-out";
      ctx!.fillStyle = `rgba(0,0,0,${theme.fade})`;
      ctx!.fillRect(0, 0, w, h);
      ctx!.globalCompositeOperation = "source-over";
      ctx!.lineCap = "round";

      for (const p of particles) {
        const a = flowAngle(p.x, p.y, t);
        p.vx += Math.cos(a) * 0.04 * dt;
        p.vy += Math.sin(a) * 0.04 * dt;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          const R = 210;
          if (d < R && d > 1) {
            const f = ((1 - d / R) ** 2 / d) * dt;
            /* tangential swirl + slight outward push */
            p.vx += (-dy * 0.38 + dx * 0.12) * f;
            p.vy += (dx * 0.38 + dy * 0.12) * f;
          }
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        const sp = Math.hypot(p.vx, p.vy);
        const max = 0.85;
        if (sp > max) {
          p.vx = (p.vx / sp) * max;
          p.vy = (p.vy / sp) * max;
        }

        p.px = p.x;
        p.py = p.y;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        /* wrap edges, resetting the trail so no streak crosses the screen */
        if (p.x < -8) p.x = w + 8;
        else if (p.x > w + 8) p.x = -8;
        if (p.y < -8) p.y = h + 8;
        else if (p.y > h + 8) p.y = -8;
        if (Math.abs(p.x - p.px) > 20 || Math.abs(p.y - p.py) > 20) {
          p.px = p.x;
          p.py = p.y;
        }

        ctx!.strokeStyle = `rgba(${theme.colors[p.color]},${
          theme.alphaBase + p.aSeed * theme.alphaVar
        })`;
        ctx!.lineWidth = 0.7 + p.wSeed * p.wSeed * 1.3;
        ctx!.beginPath();
        ctx!.moveTo(p.px, p.py);
        ctx!.lineTo(p.x, p.y);
        ctx!.stroke();
      }

      raf = requestAnimationFrame(frame);
    }

    function onPointerMove(e: PointerEvent) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    }
    function onPointerOut() {
      pointer.active = false;
    }

    reseed();
    if (reduced) {
      wrapper.style.opacity = "0.6";
      drawStatic();
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerOut);
      window.addEventListener("blur", onPointerOut);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(() => {
      reseed();
      if (reduced) drawStatic();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      redrawStaticRef.current = null;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerOut);
      window.removeEventListener("blur", onPointerOut);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        /* thin the field behind the centered content column */
        WebkitMaskImage:
          "radial-gradient(60% 58% at 50% 44%, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.5) 48%, rgba(0,0,0,1) 82%)",
        maskImage:
          "radial-gradient(60% 58% at 50% 44%, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.5) 48%, rgba(0,0,0,1) 82%)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
