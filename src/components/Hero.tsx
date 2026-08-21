"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

/* word-by-word blur reveal */
function Headline() {
  const words = [
    { text: "I" },
    { text: "architect" },
    { text: "production" },
    { text: "AI systems," },
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
        Relja Bulajić · Senior AI Systems Engineer · Full-Stack iOS Developer
      </motion.p>

      <Headline />

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.75 }}
        className="relative z-10 mt-7 max-w-xl text-pretty text-base text-muted sm:text-lg"
      >
        Independently built systems with 57 AI modules, 18 specialized agents,
        custom model orchestration and complete Python backends, next to 12
        native iOS apps live on the App Store. I turn prompts, tools and
        context into reliable production behavior.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href="/ai-systems"
          className="rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-transform duration-300 hover:scale-[1.03]"
        >
          Inspect the AI systems
        </Link>
        <a
          href="https://github.com/R3LJA"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-hairline-strong px-7 py-3 text-sm font-medium text-foreground/90 backdrop-blur transition-colors hover:border-accent/50 hover:text-accent"
        >
          <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
            <path d="M12 .7C5.7.7.7 5.8.7 12.1c0 5 3.2 9.3 7.7 10.8.6.1.8-.2.8-.5v-2.2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.3-5.1-5.6 0-1.2.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 3.1 1.2a10.8 10.8 0 0 1 5.6 0c2.1-1.5 3.1-1.2 3.1-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.3-5.2 5.6.4.4.8 1.1.8 2.1v3.2c0 .3.2.7.8.5a11.4 11.4 0 0 0 7.7-10.8C23.3 5.8 18.3.7 12 .7Z" />
          </svg>
          GitHub profile
        </a>
        <Link
          href="/work"
          className="rounded-full border border-hairline-strong px-7 py-3 text-sm font-medium text-foreground/90 backdrop-blur transition-colors hover:border-accent/50 hover:text-accent"
        >
          All product work
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
