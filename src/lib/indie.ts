import { apps, type AppProject } from "@/lib/apps";

// Server-only data for /indie: Relja's own App Store apps, their icons from
// Apple's public lookup API, and live MRR plus a 12-month MRR history from
// RevenueCat. Nothing is ever estimated: without RevenueCat data a card simply
// shows no number and no chart, except the apps listed in NO_REVENUE_YET.

// Order on the page. Only founder apps that are live on the App Store.
const INDIE_SLUGS = [
  "airposture",
  "vael",
  "recite",
  "peptyx",
  "gut",
  "held",
  "kora",
  "labplus",
  "walletzen",
  "spartime",
];

// The apps the page leads with.
const MAIN_SLUGS = new Set(["airposture", "vael"]);

// Apps that earn nothing yet (Relja, Oct 17 2026), shown as $0 without a
// RevenueCat key. Once an app gets a key, its live number wins. Remove an app
// from here the day it starts earning, or the page keeps saying $0.
const NO_REVENUE_YET = new Set([
  "recite",
  "peptyx",
  "gut",
  "held",
  "kora",
  "labplus",
  "walletzen",
  "spartime",
]);

export type Point = { t: number; v: number }; // t in ms, v in USD

export type IndieApp = {
  slug: string;
  name: string;
  tagline: string;
  accent: string;
  appStoreUrl: string;
  main: boolean;
  iconUrl: string | null;
  mrr: number | null; // null when RevenueCat is not connected and the app isn't in NO_REVENUE_YET
  series: Point[] | null; // monthly MRR, oldest first
};

const RC = "https://api.revenuecat.com/v2";

function appStoreId(url: string): string | null {
  return url.match(/id(\d+)/)?.[1] ?? null;
}

async function lookupIcons(ids: string[]): Promise<Map<string, string>> {
  const byId = new Map<string, string>();
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${ids.join(",")}&country=us`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return byId;
    const data = (await res.json()) as { results?: { trackId: number; artworkUrl512?: string }[] };
    for (const r of data.results ?? []) {
      if (r.artworkUrl512) byId.set(String(r.trackId), r.artworkUrl512);
    }
  } catch {
    // Icons are decoration; cards fall back to a letter.
  }
  return byId;
}

// Each app is its own RevenueCat project. The key lives in .env.local as
// REVENUECAT_<SLUG>_API_KEY (a v2 secret key with charts_metrics:overview:read
// and charts_metrics:charts:read). A v2 key belongs to one project, so the
// project id is read from the key unless REVENUECAT_<SLUG>_PROJECT_ID is set.
async function rcCreds(slug: string) {
  const prefix = `REVENUECAT_${slug.toUpperCase()}`;
  const apiKey = process.env[`${prefix}_API_KEY`]?.trim();
  if (!apiKey) return null;
  const projectId = process.env[`${prefix}_PROJECT_ID`]?.trim() || (await rcProjectId(apiKey));
  return projectId ? { projectId, apiKey } : null;
}

async function rcProjectId(apiKey: string): Promise<string | null> {
  try {
    const data = (await rcGet("/projects", apiKey, 86400)) as { items?: { id: string }[] };
    return data.items?.length === 1 ? data.items[0].id : null;
  } catch {
    return null;
  }
}

function devWarn(slug: string, err: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[indie] ${slug}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function rcGet(path: string, apiKey: string, revalidate: number): Promise<unknown> {
  const res = await fetch(`${RC}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`RevenueCat ${res.status} on ${path}`);
  return res.json();
}

async function fetchMrr(slug: string): Promise<number | null> {
  const creds = await rcCreds(slug);
  if (!creds) return null;
  try {
    const data = (await rcGet(
      `/projects/${creds.projectId}/metrics/overview?currency=USD`,
      creds.apiKey,
      3600,
    )) as { metrics?: { id: string; name: string; value: number }[] };
    const mrr = data.metrics?.find((m) => m.id === "mrr" || m.name.toUpperCase() === "MRR");
    return typeof mrr?.value === "number" ? mrr.value : null;
  } catch (err) {
    devWarn(slug, err);
    return null;
  }
}

// Finds the resolution id whose display name is "month" anywhere in the
// chart options response (the id differs per chart, per RevenueCat's docs).
function findMonthResolution(node: unknown): string | null {
  if (Array.isArray(node)) {
    for (const item of node) {
      const hit = findMonthResolution(item);
      if (hit) return hit;
    }
    return null;
  }
  if (node && typeof node === "object") {
    const o = node as Record<string, unknown>;
    if (typeof o.display_name === "string" && o.display_name.toLowerCase() === "month" && o.id != null) {
      return String(o.id);
    }
    for (const v of Object.values(o)) {
      const hit = findMonthResolution(v);
      if (hit) return hit;
    }
  }
  return null;
}

function toMs(t: unknown): number {
  if (typeof t === "number") return t < 1e12 ? t * 1000 : t;
  if (typeof t === "string") return Date.parse(t);
  return NaN;
}

// RevenueCat documents `values` only as "arrays of numbers or objects with
// timestamps and values", so accept both shapes.
function parsePoints(values: unknown): Point[] {
  if (!Array.isArray(values)) return [];
  const out: Point[] = [];
  for (const item of values) {
    if (Array.isArray(item) && item.length >= 2 && typeof item[1] === "number") {
      out.push({ t: toMs(item[0]), v: item[1] });
    } else if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      const v = [o.value, o.v, o.y].find((x): x is number => typeof x === "number");
      const t = o.cohort ?? o.date ?? o.timestamp ?? o.t ?? o.x;
      if (v !== undefined && t !== undefined) out.push({ t: toMs(t), v });
    }
  }
  return out.filter((p) => Number.isFinite(p.t)).sort((a, b) => a.t - b.t);
}

async function fetchSeries(slug: string): Promise<Point[] | null> {
  const creds = await rcCreds(slug);
  if (!creds) return null;
  try {
    const base = `/projects/${creds.projectId}/charts/mrr`;
    const options = await rcGet(`${base}/options`, creds.apiKey, 86400);
    const resolution = findMonthResolution(options);
    if (!resolution) return null;
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth() - 11, 1);
    const day = (d: Date) => d.toISOString().slice(0, 10);
    const data = (await rcGet(
      `${base}?start_date=${day(start)}&end_date=${day(end)}&resolution=${resolution}&currency=USD`,
      creds.apiKey,
      21600,
    )) as { values?: unknown };
    const points = parsePoints(data.values);
    if (points.length < 2) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[indie] ${slug}: MRR chart returned no usable points`);
      }
      return null;
    }
    return points;
  } catch (err) {
    devWarn(slug, err);
    return null;
  }
}

export async function getIndieApps(): Promise<IndieApp[]> {
  const chosen = INDIE_SLUGS.map((slug) => apps.find((a) => a.slug === slug)).filter(
    (a): a is AppProject & { appStoreUrl: string } => Boolean(a?.appStoreUrl),
  );
  const ids = chosen.map((a) => appStoreId(a.appStoreUrl)).filter((id): id is string => Boolean(id));
  const [icons, mrrs, series] = await Promise.all([
    lookupIcons(ids),
    Promise.all(chosen.map((a) => fetchMrr(a.slug))),
    Promise.all(chosen.map((a) => fetchSeries(a.slug))),
  ]);

  return chosen.map((a, i) => {
    const id = appStoreId(a.appStoreUrl);
    return {
      slug: a.slug,
      name: a.name,
      tagline: a.tagline,
      accent: a.accent,
      appStoreUrl: a.appStoreUrl,
      main: MAIN_SLUGS.has(a.slug),
      iconUrl: (id && icons.get(id)) || null,
      mrr: mrrs[i] ?? (NO_REVENUE_YET.has(a.slug) ? 0 : null),
      series: series[i],
    };
  });
}

export function totalMrr(list: IndieApp[]): number | null {
  const connected = list.filter((a) => a.mrr !== null);
  if (connected.length === 0) return null;
  return connected.reduce((sum, a) => sum + (a.mrr ?? 0), 0);
}

// All apps' monthly MRR added up, for the revenue widget.
export function totalSeries(list: IndieApp[]): Point[] | null {
  const byMonth = new Map<string, Point>();
  for (const app of list) {
    for (const p of app.series ?? []) {
      const d = new Date(p.t);
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
      const prev = byMonth.get(key);
      byMonth.set(key, {
        t: Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1),
        v: (prev?.v ?? 0) + p.v,
      });
    }
  }
  const points = [...byMonth.values()].sort((a, b) => a.t - b.t);
  return points.length >= 2 ? points : null;
}
