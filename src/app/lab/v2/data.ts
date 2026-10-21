import { flagshipSystems } from "@/lib/aiSystems";
import { apps } from "@/lib/apps";

// Everything here comes from the current portfolio's data files, so the
// prototype says nothing the live site doesn't already back up.

export type AiCase = {
  slug: string;
  name: string;
  category: string;
  headline: string;
  summary: string;
  accent: string;
  href: string;
};

export type IosApp = {
  slug: string;
  name: string;
  tagline: string;
  accent: string;
  screen: string;
  storeUrl?: string;
  href: string;
};

const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0];

export const aiCases: AiCase[] = ["launchpilot", "deeplead", "supportagent", "voicevault", "paycontrol"].map(
  (slug) => {
    const s = flagshipSystems.find((x) => x.slug === slug)!;
    return {
      slug,
      name: s.name,
      category: s.category,
      headline: s.headline,
      summary: firstSentence(s.summary),
      accent: s.accent,
      href: `/lab/v2/systems/${slug}`,
    };
  },
);

const SCREENS: Record<string, string> = {
  airposture: "/apps/airposture/v2-session.png",
  vael: "/apps/vael/hero-light.png",
  recite: "/apps/recite/screenshots/01.png",
  gut: "/apps/gut/screenshots/01.png",
  held: "/apps/held/screenshots/01.png",
  kora: "/apps/kora/screenshots/01.png",
  walletzen: "/apps/walletzen/screenshots/01.png",
  spartime: "/apps/spartime/screenshots/01.png",
};

export const iosApps: IosApp[] = Object.keys(SCREENS).map((slug) => {
  const a = apps.find((x) => x.slug === slug)!;
  return {
    slug,
    name: a.name,
    tagline: a.tagline,
    accent: a.accent,
    screen: SCREENS[slug],
    storeUrl: a.appStoreUrl,
    href: `/work/${slug}`,
  };
});

export const STATEMENT =
  "Most AI demos break the day they meet real customers. I build the part after the demo: approval before anything moves, a record of every action, evals before every release, and a hard ceiling on cost.";

export const LINKS = {
  github: "https://github.com/R3LJA",
  appStore: "https://apps.apple.com/md/developer/relja-bulajic/id1801518678",
};
