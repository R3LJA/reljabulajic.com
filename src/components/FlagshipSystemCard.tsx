import Link from "next/link";
import type { AiSystem } from "@/lib/aiSystems";
import SystemScene from "@/components/SystemScene";

export default function FlagshipSystemCard({
  system,
  index = 0,
}: {
  system: AiSystem;
  index?: number;
}) {
  return (
    <Link
      href={`/ai-systems/${system.slug}`}
      className="group relative grid overflow-hidden rounded-[2rem] border border-hairline bg-surface transition-all duration-500 hover:-translate-y-1 hover:border-hairline-strong lg:grid-cols-[0.88fr_1.12fr]"
    >
      <div className="relative min-h-64 overflow-hidden border-b border-hairline lg:min-h-[390px] lg:border-b-0 lg:border-r">
        <SystemScene
          slug={system.slug}
          accent={system.accent}
          compact={index > 1}
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
        <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
          Independently built end to end
        </span>
      </div>

      <div className="relative flex flex-col p-7 sm:p-9">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(70% 70% at 100% 0%, ${system.accent}12 0%, transparent 72%)`,
          }}
        />
        <div className="relative">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.24em]"
            style={{ color: system.accent }}
          >
            {system.category}
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {system.name}
          </h3>
          <p className="mt-3 text-pretty text-base font-medium leading-relaxed text-foreground/90">
            {system.headline}
          </p>
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">
            {system.summary}
          </p>
        </div>

        <div className="relative mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline">
          {system.metrics.map((metric) => (
            <div key={metric.label} className="bg-surface/90 px-4 py-4">
              <p className="text-xl font-semibold tracking-tight">
                {metric.value}
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-faint">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        <div className="relative mt-auto flex items-center justify-between pt-7 text-sm font-medium">
          <span>Inspect the architecture</span>
          <span
            className="text-xl transition-transform duration-300 group-hover:translate-x-1.5"
            style={{ color: system.accent }}
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
