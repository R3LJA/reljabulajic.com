import Link from "next/link";
import BrowserFrame from "@/components/BrowserFrame";
import DeviceFrame from "@/components/DeviceFrame";
import Reveal from "@/components/Reveal";
import type { AppProject } from "@/lib/apps";

export default function ProjectCard({
  app,
  screenshot,
  index = 0,
}: {
  app: AppProject;
  screenshot?: string;
  index?: number;
}) {
  return (
    <Reveal delay={(index % 3) * 0.08}>
      <Link
        href={`/work/${app.slug}`}
        className="group relative block overflow-hidden rounded-3xl border border-hairline bg-surface transition-colors duration-300 hover:border-hairline-strong"
      >
        {/* accent glow on hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(80% 60% at 50% 0%, ${app.accent}14 0%, transparent 70%)`,
          }}
        />
        <div className="relative flex flex-col gap-6 p-7">
          {app.platform === "web" ? (
            <div className="flex min-h-[19rem] items-center pt-4 transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.015]">
              <BrowserFrame
                src={screenshot}
                alt={`${app.name} screenshot`}
                accent={app.accent}
                label={app.name}
              />
            </div>
          ) : (
            <div className="mx-auto w-[58%] pt-4 transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.015]">
              <DeviceFrame
                src={screenshot}
                alt={`${app.name} screenshot`}
                accent={app.accent}
                label={app.name}
              />
            </div>
          )}
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight">
                {app.name}
              </h3>
              {app.client ? (
                <span className="rounded-full border border-hairline px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted">
                  Client
                </span>
              ) : (
                <span
                  className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest"
                  style={{
                    borderColor: `${app.accent}35`,
                    color: `${app.accent}cc`,
                  }}
                >
                  Founder
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">{app.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {app.stack.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-foreground/[0.04] px-2.5 py-1 text-[11px] text-faint ring-hairline"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
