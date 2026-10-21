import type { Metadata } from "next";
import Instrument, { type LiveApp } from "./Instrument";

// Design prototype. Not linked from any portfolio page, not indexed.

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Relja Bulajić | Instrument (prototype)",
  description:
    "Forward deployed AI engineer for agents that touch real money and real customers. iOS apps shipped solo.",
  robots: { index: false, follow: false },
};

const UPWORK_PROFILE_URL = "https://www.upwork.com/freelancers/~011b06c043368ef973";

// Founder apps live on the App Store, with a real screen each (public/apps).
const APPS: Omit<LiveApp, "iconUrl">[] = [
  {
    slug: "airposture",
    name: "AirPosture",
    tagline: "Your AirPods are a posture sensor.",
    detail: "Head motion from AirPods drives a voice coach. Every release passes a simulator eval gate first.",
    platforms: "iPhone · Watch · Mac",
    appStoreUrl: "https://apps.apple.com/us/app/sit-straight-airposture/id6749489000",
  },
  {
    slug: "vael",
    name: "Vael",
    tagline: "Your wardrobe, styled by AI.",
    detail: "Virtual try-on and daily outfits, with AI cost metered per feature and keys kept off the device.",
    platforms: "iPhone · Web · Chrome",
    appStoreUrl: "https://apps.apple.com/us/app/ai-wardrobe-try-on-vael/id6766129301",
  },
  {
    slug: "recite",
    name: "Recite",
    tagline: "Explain it out loud. AI grades you.",
    detail: "Voice quizzes from your own course material, with Screen Time shields until you study.",
    platforms: "iPhone",
    appStoreUrl: "https://apps.apple.com/us/app/recite-voice-study-ai/id6759579263",
  },
  {
    slug: "gut",
    name: "Gut",
    tagline: "A journal that sees relationship patterns.",
    detail: "Logs moments by text or voice and finds patterns across weeks, with AI disclosure built in.",
    platforms: "iPhone",
    appStoreUrl: "https://apps.apple.com/us/app/gut-relationship-red-flags/id6756668065",
  },
  {
    slug: "held",
    name: "Held",
    tagline: "Your time, protected.",
    detail: "Focus sessions that block distracting apps through Apple's Screen Time APIs.",
    platforms: "iPhone",
    appStoreUrl: "https://apps.apple.com/us/app/held-focus-screen-time/id6758916928",
  },
];

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
    // Icons are decoration; the app list falls back to a letter.
  }
  return byId;
}

export default async function InstrumentPage() {
  const idOf = (url: string) => url.match(/id(\d+)/)?.[1] ?? "";
  const icons = await lookupIcons(APPS.map((a) => idOf(a.appStoreUrl)));
  const apps: LiveApp[] = APPS.map((a) => ({ ...a, iconUrl: icons.get(idOf(a.appStoreUrl)) ?? null }));
  return <Instrument apps={apps} upworkUrl={UPWORK_PROFILE_URL} />;
}
