import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-hairline px-6 pb-32 pt-16">
      <div className="mx-auto grid w-full max-w-6xl gap-10 sm:grid-cols-[2fr_1fr]">
        {/* brand */}
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl border border-hairline-strong text-accent">
              <span className="serif-accent text-lg">R</span>
            </span>
            <span className="font-semibold tracking-tight">Relja Bulajić</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Founder, full-stack & AI engineer. I design, build and ship
            products end to end, from SwiftUI to custom backends.
          </p>
          <p className="mt-4 flex items-center gap-2 text-xs text-faint">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            Available for work · Belgrade, Serbia
          </p>
        </div>

        {/* pages */}
        <div>
          <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-faint">
            Pages
          </h3>
          <ul className="mt-4 space-y-2.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="mx-auto mt-14 flex w-full max-w-6xl flex-col items-center justify-between gap-3 border-t border-hairline pt-8 text-xs text-faint sm:flex-row">
        <p>© {new Date().getFullYear()} Relja Bulajić. All rights reserved.</p>
        <p>Designed & built from scratch with Next.js.</p>
      </div>
    </footer>
  );
}
