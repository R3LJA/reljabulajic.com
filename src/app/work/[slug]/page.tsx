import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppStoreBadge from "@/components/AppStoreBadge";
import BrowserFrame from "@/components/BrowserFrame";
import DeviceFrame from "@/components/DeviceFrame";
import Reveal from "@/components/Reveal";
import { apps } from "@/lib/apps";
import { getScreenshots } from "@/lib/screenshots";

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = apps.find((a) => a.slug === slug);
  if (!app) return {};
  return {
    title: `${app.name} · Relja Bulajić`,
    description: app.tagline,
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = apps.find((a) => a.slug === slug);
  if (!app) notFound();

  const shots = getScreenshots(app.slug);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-28">
      {/* hero */}
      <Reveal>
        <Link
          href="/work"
          className="text-sm text-muted transition-colors hover:text-accent"
        >
          ← All work
        </Link>
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-baseline gap-4">
              <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
                {app.name}
              </h1>
              {app.client && (
                <span className="rounded-full border border-hairline px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-muted">
                  Client project
                </span>
              )}
            </div>
            <p
              className="serif-accent mt-4 text-2xl sm:text-3xl"
              style={{ color: app.accent }}
            >
              {app.tagline}
            </p>
          </div>
          {app.platform !== "web" && (
            <AppStoreBadge href={app.appStoreUrl} className="shrink-0 sm:mt-2" />
          )}
        </div>
      </Reveal>

      {/* screenshots strip */}
      <Reveal delay={0.1}>
        <div
          className="relative mt-16 overflow-hidden rounded-[2.5rem] border border-hairline px-6 py-14 sm:px-14"
          style={{
            background: `radial-gradient(90% 100% at 50% 0%, ${app.accent}12 0%, transparent 65%), var(--surface)`,
          }}
        >
          {app.platform === "web" ? (
            <div className="mx-auto max-w-3xl">
              <BrowserFrame
                src={shots[0]}
                alt={`${app.name} screenshot`}
                accent={app.accent}
                label={app.name}
                priority
              />
            </div>
          ) : (
            <div className="no-scrollbar flex gap-8 overflow-x-auto pb-2 sm:justify-center">
              {(shots.length ? shots.slice(0, 3) : [undefined]).map((src, i) => (
                <div
                  key={src ?? i}
                  className="w-[220px] shrink-0 sm:w-[250px]"
                  style={{
                    transform: `translateY(${i === 1 ? "-12px" : "0"})`,
                  }}
                >
                  <DeviceFrame
                    src={src}
                    alt={`${app.name} screen ${i + 1}`}
                    accent={app.accent}
                    label={app.name}
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      {/* details */}
      <div className="mt-20 grid gap-14 lg:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">
            About the <span className="serif-accent text-accent">product</span>
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-foreground/80">
            {app.description}
          </p>
          {app.metrics && (
            <ul className="mt-8 space-y-3">
              {app.metrics.map((m) => (
                <li
                  key={m}
                  className="flex items-center gap-3 text-sm text-foreground/85"
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: app.accent }}
                  />
                  {m}
                </li>
              ))}
            </ul>
          )}
        </Reveal>
        <Reveal delay={0.08}>
          <div className="rounded-3xl border border-hairline bg-surface p-7">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-faint">
              Role
            </h3>
            <p className="mt-2 text-sm text-foreground/85">{app.role}</p>
            {app.platforms && (
              <>
                <h3 className="mt-7 text-xs font-medium uppercase tracking-[0.2em] text-faint">
                  Platforms
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {app.platforms.map((p) => (
                    <span
                      key={p}
                      className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                      style={{
                        color: app.accent,
                        background: `${app.accent}1a`,
                        boxShadow: `inset 0 0 0 1px ${app.accent}33`,
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </>
            )}
            <h3 className="mt-7 text-xs font-medium uppercase tracking-[0.2em] text-faint">
              Stack
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {app.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-foreground/[0.04] px-2.5 py-1 text-[11px] text-muted ring-hairline"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* next project */}
      <Reveal>
        <NextProject slug={app.slug} />
      </Reveal>
    </main>
  );
}

function NextProject({ slug }: { slug: string }) {
  const idx = apps.findIndex((a) => a.slug === slug);
  const next = apps[(idx + 1) % apps.length];
  return (
    <Link
      href={`/work/${next.slug}`}
      className="group mt-24 flex items-center justify-between rounded-3xl border border-hairline bg-surface px-8 py-10 transition-colors hover:border-hairline-strong"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-faint">
          Next project
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight">
          {next.name}
        </p>
      </div>
      <span
        className="text-3xl transition-transform duration-300 group-hover:translate-x-1.5"
        style={{ color: next.accent }}
      >
        →
      </span>
    </Link>
  );
}
