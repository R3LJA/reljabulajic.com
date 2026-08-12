"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

/* word-by-word blur reveal */
function Headline() {
  const words = [
    { text: "I" },
    { text: "engineer" },
    { text: "AI" },
    { text: "products," },
    { text: "end to end.", serif: true },
  ];
  return (
    <h1 className="relative z-10 max-w-4xl text-balance text-5xl font-semibold leading-[1.04] tracking-tight sm:text-7xl">
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.65,
            delay: 0.25 + i * 0.07,
            ease: [0.21, 0.6, 0.35, 1],
          }}
          className={`inline-block ${
            w.serif ? "serif-accent gradient-text" : ""
          }`}
        >
          {w.text}
          {i < words.length - 1 && <span>&nbsp;</span>}
        </motion.span>
      ))}
    </h1>
  );
}

/* slow-drifting aurora blobs */
function Aurora() {
  const blobs = [
    {
      color: "var(--aurora-1)",
      size: "55vw",
      x: ["-12%", "8%", "-6%"],
      y: ["-8%", "6%", "-4%"],
      duration: 26,
      left: "8%",
      top: "0%",
    },
    {
      color: "var(--aurora-2)",
      size: "44vw",
      x: ["10%", "-8%", "6%"],
      y: ["4%", "-10%", "6%"],
      duration: 32,
      left: "52%",
      top: "8%",
    },
    {
      color: "var(--aurora-3)",
      size: "40vw",
      x: ["-6%", "10%", "-8%"],
      y: ["8%", "-6%", "4%"],
      duration: 38,
      left: "30%",
      top: "34%",
    },
  ];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 -z-20 h-full w-screen -translate-x-1/2 overflow-hidden"
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          animate={{ x: b.x, y: b.y }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            top: b.top,
            background: `radial-gradient(circle at center, ${b.color} 0%, transparent 65%)`,
            filter: "blur(40px)",
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[92svh] flex-col items-center justify-center text-center">
      <Aurora />

      {/* theme switcher */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute right-0 top-7 sm:right-2"
      >
        <ThemeToggle />
      </motion.div>

      {/* avatar + availability badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.05 }}
        className="relative z-10 mb-6 flex flex-col items-center gap-3.5"
      >
        <div className="relative">
          {/* soft accent ring glow */}
          <div
            aria-hidden
            className="absolute -inset-1.5 rounded-full opacity-60"
            style={{
              background:
                "conic-gradient(from 180deg, rgba(200,182,155,0.5), rgba(125,184,232,0.25), rgba(167,139,250,0.3), rgba(200,182,155,0.5))",
              filter: "blur(6px)",
            }}
          />
          <Image
            src="/photos/relja-portrait.jpeg"
            alt="Relja Bulajić"
            width={176}
            height={176}
            priority
            className="relative size-[88px] rounded-full border border-hairline-strong object-cover"
            style={{ objectPosition: "50% 26%" }}
          />
        </div>
        <span className="badge-available flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
          </span>
          Available for work
        </span>
      </motion.div>

      {/* copy */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 mb-5 text-xs font-medium uppercase tracking-[0.28em] text-muted"
      >
        Relja Bulajić · Founder · Full-Stack & AI Engineer · Belgrade
      </motion.p>

      <Headline />

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.75 }}
        className="relative z-10 mt-7 max-w-xl text-pretty text-base text-muted sm:text-lg"
      >
        12 of my own apps live on the App Store with 4,000+ users, and clients
        get the same founder-level ownership: production AI, custom Python
        backends and polished native front ends.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href="/work"
          className="rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-transform duration-300 hover:scale-[1.03]"
        >
          See the work
        </Link>
        <a
          href="https://apps.apple.com/md/developer/relja-bulajic/id1801518678"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-hairline-strong px-7 py-3 text-sm font-medium text-foreground/90 backdrop-blur transition-colors hover:border-accent/50 hover:text-accent"
        >
          <svg viewBox="0 0 384 512" className="size-4 fill-current" aria-hidden>
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
          </svg>
          All my apps
        </a>
        <Link
          href="/about"
          className="rounded-full border border-hairline-strong px-7 py-3 text-sm font-medium text-foreground/90 backdrop-blur transition-colors hover:border-accent/50 hover:text-accent"
        >
          About me
        </Link>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
        className="absolute bottom-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-faint"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-5">
            <path
              d="m6 10 6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
