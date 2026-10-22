"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AiStack from "./AiStack";
import Hero, { EASE } from "./Hero";
import IosTheatre from "./IosTheatre";
import Reviews from "./Reviews";
import Security from "./Security";
import Speed from "./speed/Speed";
import { Close, Reel, Statement } from "./Sections";
import { AboutView, AiView, IosView } from "./Views";

type View = "home" | "ai" | "ios" | "about";
const VIEWS: { id: View; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "ai", label: "AI" },
  { id: "ios", label: "iOS" },
  { id: "about", label: "About" },
];
const TITLES: Record<View, string> = { home: "Home", ai: "AI Engineering", ios: "iOS Apps", about: "About" };

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Belgrade",
        }),
      );
    fmt();
    const id = setInterval(fmt, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time || "--:--"}</span>;
}

export default function V2() {
  const reduced = useReducedMotion();
  // ?view=ai|ios|about opens straight on that view (used by "All systems" links)
  const params = useSearchParams();
  const initial = params.get("view");
  const [view, setView] = useState<View>(
    initial === "ai" || initial === "ios" || initial === "about" ? initial : "home",
  );
  // The wipe: a panel rises with the next page's name, the view swaps
  // underneath it, then the panel leaves through the top.
  const [wipe, setWipe] = useState<View | null>(null);
  const statementRef = useRef<HTMLDivElement>(null);

  function go(next: View) {
    if (next === view || wipe) return;
    if (reduced) {
      setView(next);
      window.scrollTo(0, 0);
      return;
    }
    setWipe(next);
    window.setTimeout(() => {
      setView(next);
      window.scrollTo(0, 0);
    }, 800);
    window.setTimeout(() => setWipe(null), 950);
  }

  return (
    <>
      {/* header: inverts against whatever is behind it */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-[5vw] py-6 text-white mix-blend-difference md:px-[2.4vw]">
        <button type="button" onClick={() => go("home")} className="pointer-events-auto text-lg tracking-[-0.02em]">
          Relja Bulajić
        </button>
        <span className="text-sm opacity-70">
          Belgrade <Clock />
        </span>
      </header>

      <main>
        {view === "home" && (
          <>
            <Hero onScrollDown={() => statementRef.current?.scrollIntoView({ behavior: "smooth" })} />
            <div ref={statementRef}>
              <Statement />
            </div>
            {/* what I build, then the proof, then the pace; iOS backs it up */}
            <AiStack />
            <Reviews />
            <Security />
            <Speed />
            <Reel />
            <IosTheatre />
            <Close />
          </>
        )}
        {view === "ai" && <AiView />}
        {view === "ios" && <IosView />}
        {view === "about" && <AboutView />}
      </main>

      {/* nav pill */}
      <nav className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
        <div className="flex gap-1 rounded-full border border-black/5 bg-white/80 p-1.5 shadow-[0_12px_40px_-14px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => go(v.id)}
              aria-current={view === v.id ? "page" : undefined}
              className={`relative rounded-full px-4 py-2.5 text-[13px] font-medium tracking-[0.02em] transition-colors md:px-5 ${
                view === v.id ? "text-[var(--night-ink)]" : "text-[var(--ink)]/70 hover:text-[var(--ink)]"
              }`}
            >
              {view === v.id && (
                <motion.span
                  layoutId="v2-nav"
                  className="absolute inset-0 rounded-full bg-[var(--ink)]"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">{v.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* page transition */}
      <AnimatePresence>
        {wipe && (
          <motion.div
            key={wipe}
            className="fixed inset-0 z-50 flex flex-col justify-end overflow-hidden bg-[var(--night)] px-[5vw] pb-[10vh] text-[var(--night-ink)] md:px-[9vw]"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.p
              className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              Relja Bulajić
            </motion.p>
            <span className="v2-display text-[12vw] md:text-[6.4vw]">
              <span className="v2-mask">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
                >
                  {TITLES[wipe]}
                </motion.span>
              </span>
            </span>
            <motion.div
              className="mt-8 h-px origin-left bg-[var(--gold)]/60"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
