import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";
import RevenueChart from "@/components/indie/RevenueChart";
import ThemeSwitch from "@/components/indie/ThemeSwitch";
import TopBar from "@/components/indie/TopBar";
import { getIndieApps, totalMrr, totalSeries, type IndieApp } from "@/lib/indie";

// Unlisted: no portfolio page links here and search engines are told not to
// index it. The portfolio goes into Upwork proposals and must never lead to
// this page's email signup. Reached only by its direct link.

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Relja Bulajić | Indie page",
  description:
    "I build iOS apps solo, and the AI agents that market them. Every app is mine, and the revenue is public.",
  robots: { index: false, follow: false },
};

// X and LinkedIn go here once Relja sends the links.
const SOCIALS = [
  {
    href: "https://github.com/R3LJA",
    label: "GitHub",
    path: "M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.7c-2.7.6-3.2-1.2-3.2-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.1-.2-4.4-1.1-4.4-4.7 0-1 .4-1.9 1-2.6-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.3 2.6-1 2.6-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.6 0 3.7-2.3 4.5-4.4 4.7.3.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z",
  },
  {
    href: "https://apps.apple.com/md/developer/relja-bulajic/id1801518678",
    label: "App Store",
    path: "M6 3.5h12A2.5 2.5 0 0 1 20.5 6v12a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 18V6A2.5 2.5 0 0 1 6 3.5ZM9 16.5l4-7M15 16.5l-4-7M7.5 14h9",
  },
];

const isDev = process.env.NODE_ENV === "development";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: n >= 10000 ? "compact" : "standard",
    maximumFractionDigits: n >= 1000 ? 1 : 0,
  }).format(n);

function Icon({ app }: { app: IndieApp }) {
  const cls = "size-11 shrink-0 rounded-[23%] border border-[var(--i-line)] sm:size-12";
  if (!app.iconUrl) {
    return (
      <span
        className={`${cls} flex items-center justify-center font-bold`}
        style={{ background: `${app.accent}33`, color: app.accent }}
      >
        {app.name[0]}
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={app.iconUrl} alt="" width={48} height={48} className={cls} loading="lazy" />;
}

function SocialLinks() {
  return (
    <>
      {SOCIALS.map((s) => (
        <a
          key={s.href}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          className="flex size-9 items-center justify-center rounded-full text-[var(--i-muted)] transition-colors hover:bg-[var(--i-surface)] hover:text-[var(--i-ink)]"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-[18px]">
            <path d={s.path} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      ))}
      <ThemeSwitch className="flex size-9 items-center justify-center rounded-full text-[var(--i-muted)] transition-colors hover:bg-[var(--i-surface)] hover:text-[var(--i-ink)]" />
    </>
  );
}

export default async function IndiePage() {
  const list = await getIndieApps();
  const total = totalMrr(list);
  const series = totalSeries(list);
  const missing = list.filter((a) => a.mrr === null).map((a) => a.name);
  const hasData = missing.length < list.length;
  const showNumbers = hasData || isDev;

  // Rank by revenue; an app not connected yet counts as $0 rather than below
  // zero, and on ties the two apps being grown lead.
  const ranked = [...list].sort(
    (a, b) => (b.mrr ?? 0) - (a.mrr ?? 0) || Number(b.main) - Number(a.main),
  );

  const cols = showNumbers
    ? "grid-cols-[1.75rem_minmax(0,1fr)_auto] md:grid-cols-[2.5rem_minmax(0,1.1fr)_minmax(0,1.5fr)_8.5rem_6.5rem_1.25rem]"
    : "grid-cols-[1.75rem_minmax(0,1fr)_auto] md:grid-cols-[2.5rem_minmax(0,1.1fr)_minmax(0,1.5fr)_1.25rem]";

  return (
    <>
      <TopBar watch="hero-signup">
        <SocialLinks />
      </TopBar>

      <main className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
        {/* masthead */}
        <section className="indie-rise grid gap-10 border-b border-[var(--i-line)] py-12 sm:py-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-5">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-[28%] border border-[var(--i-line)] shadow-[var(--i-shadow)] sm:size-28">
                <Image
                  src="/photos/relja-indie.jpg"
                  alt="Relja Bulajić"
                  fill
                  priority
                  sizes="(min-width: 640px) 112px, 80px"
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-[var(--i-muted)] sm:text-base">
                Solo iOS developer
                <br />
                Belgrade, Serbia
              </p>
            </div>

            <h1 className="indie-display mt-8 text-[3.2rem] font-extrabold leading-[0.92] sm:text-8xl lg:text-[7.5rem]">
              Relja Bulajić
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-xl leading-snug sm:text-[1.7rem]">
              I build iOS apps <span className="indie-mark">solo</span>, and the AI agents that market
              them. Every number on this page is real.
            </p>

            <div id="hero-signup" className="mt-8 max-w-xl">
              <p className="mb-3 text-[15px] text-[var(--i-muted)]">
                One email a month: what I shipped, what made money, what didn&apos;t.
              </p>
              <SubscribeForm
                formClassName="flex"
                buttonLabel="Subscribe"
                placeholder="Your email"
                inputClassName="min-w-0 flex-1 rounded-l-full border border-r-0 border-[var(--i-line-strong)] bg-[var(--i-surface)] px-5 py-3.5 text-base outline-none transition-colors placeholder:text-[var(--i-faint)] focus:border-[var(--i-ink)]"
                buttonClassName="shrink-0 rounded-r-full bg-[var(--i-ink)] px-6 py-3.5 text-base font-semibold text-[var(--i-bg)] transition-opacity hover:opacity-90 disabled:opacity-60"
                doneClassName="rounded-full bg-[var(--i-mark)] px-5 py-3.5 text-base font-medium text-[var(--i-mark-ink)]"
              />
            </div>
          </div>

          {/* revenue panel */}
          <aside className="flex flex-col justify-center lg:col-span-4 lg:border-l lg:border-[var(--i-line)] lg:pl-12">
            {showNumbers ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--i-faint)]">
                  Monthly revenue
                </p>
                <p className="indie-display mt-2 text-6xl font-extrabold leading-none sm:text-7xl">
                  {total !== null ? usd(total) : "—"}
                  <span className="text-2xl font-bold text-[var(--i-faint)]">/mo</span>
                </p>
                <p className="mt-2 text-[15px] text-[var(--i-muted)]">
                  from {list.length} apps, live from RevenueCat
                  {missing.length > 0 && `. Not connected yet: ${missing.join(", ")}`}
                </p>
                {series ? (
                  <RevenueChart points={series} id="total" className="mt-6" />
                ) : (
                  isDev && (
                    <div className="mt-6 flex h-24 items-center justify-center rounded-2xl border border-dashed border-[var(--i-line-strong)] font-mono text-[11px] text-[var(--i-faint)]">
                      chart once RevenueCat is connected
                    </div>
                  )
                )}
              </>
            ) : (
              <>
                <p className="indie-display text-7xl font-extrabold leading-none sm:text-8xl">{list.length}</p>
                <p className="mt-2 text-lg text-[var(--i-muted)]">iOS apps live on the App Store, all built solo</p>
              </>
            )}
          </aside>
        </section>

        {/* the apps */}
        <section className="indie-rise mt-14 [animation-delay:120ms]">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <h2 className="indie-display text-3xl font-bold sm:text-4xl">The apps</h2>
            <p className="text-sm text-[var(--i-faint)]">
              {hasData ? "Ranked by monthly revenue" : "Tap a row to open it on the App Store"}
            </p>
          </div>

          <div
            className={`mt-6 hidden gap-4 border-b border-[var(--i-line)] px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--i-faint)] md:grid ${cols}`}
          >
            <span>#</span>
            <span>App</span>
            <span>What it does</span>
            {showNumbers && <span>Last 12 months</span>}
            {showNumbers && <span className="text-right">MRR</span>}
            <span />
          </div>

          <ol className="mt-2 md:mt-0">
            {ranked.map((app, i) => (
              <li key={app.slug} className="border-b border-[var(--i-line)] py-1">
                <a
                  href={app.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`indie-row grid items-center gap-4 rounded-2xl px-3 py-3 ${cols}`}
                >
                  <span className="font-mono text-sm text-[var(--i-faint)]">{i + 1}</span>
                  <span className="flex min-w-0 items-center gap-3.5">
                    <Icon app={app} />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[17px] font-semibold">{app.name}</span>
                        {app.main && (
                          <span
                            className={`shrink-0 rounded-full bg-[var(--i-mark)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--i-mark-ink)] ${
                              showNumbers ? "max-sm:hidden" : ""
                            }`}
                          >
                            Growing
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-sm text-[var(--i-muted)] md:hidden">{app.tagline}</span>
                    </span>
                  </span>
                  <span className="hidden truncate text-[15px] text-[var(--i-muted)] md:block">{app.tagline}</span>
                  {showNumbers && (
                    <span className="hidden md:block">
                      {app.series ? (
                        <RevenueChart points={app.series} id={app.slug} compact className="h-9" />
                      ) : (
                        <span className="block h-px w-full bg-[var(--i-line-strong)]" />
                      )}
                    </span>
                  )}
                  {showNumbers && (
                    <span className="text-right font-mono text-sm tabular-nums">
                      {app.mrr === null ? (
                        <span className="text-[var(--i-faint)]">—</span>
                      ) : (
                        <span className={app.mrr === 0 ? "text-[var(--i-faint)]" : ""}>{usd(app.mrr)}/mo</span>
                      )}
                    </span>
                  )}
                  <span className="indie-row-arrow hidden text-right text-[var(--i-faint)] md:block">↗</span>
                  {!showNumbers && <span className="indie-row-arrow text-[var(--i-faint)] md:hidden">↗</span>}
                </a>
              </li>
            ))}
          </ol>
        </section>

        <footer className="mt-16 flex flex-col items-start justify-between gap-3 text-sm text-[var(--i-muted)] sm:flex-row sm:items-center">
          <span>Built solo in Belgrade.</span>
          <Link href="/" className="underline underline-offset-4 hover:text-[var(--i-ink)]">
            My portfolio
          </Link>
        </footer>
      </main>
    </>
  );
}
