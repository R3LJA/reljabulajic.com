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
  does: string[];
  gives: string;
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

// Plain words first: what it is, three things it does, what that gets you.
// Rewritten from lib/aiSystems.ts and the case-study steps, no new claims.
export const PLAIN: Record<string, { label: string; line: string; does: string[]; gives: string }> = {
  launchpilot: {
    label: "AI marketing team",
    line: "Researches, writes and publishes a brand's social media, and checks every post before it goes out.",
    does: [
      "Researches the market and plans what to post",
      "Writes each post with the AI model best suited to it, and switches models if one fails",
      "Schedules and publishes to the brand's social accounts",
    ],
    gives: "Weeks of marketing work done without hiring a marketer.",
  },
  deeplead: {
    label: "AI sales researcher",
    line: "Finds the right companies and people to sell to, checks every fact, and drafts the first email.",
    does: [
      "Researches each company across several public sources",
      "Throws out any claim it cannot back up with a source",
      "Scores who is worth contacting and drafts the email for approval",
    ],
    gives: "A salesperson's research day in minutes, with a source for every fact.",
  },
  supportagent: {
    label: "AI customer support",
    line: "Answers customers in seconds and knows exactly when to hand the conversation to a person.",
    does: [
      "Answers routine questions from each app's own help content",
      "Passes refunds, unknown bugs and upset customers to a person, with the full context",
      "Learns from every correction a person makes",
    ],
    gives: "Customers get fast answers, and you only handle the cases that need you.",
  },
  voicevault: {
    label: "Voice assistant",
    line: "Say one sentence out loud and it becomes a note, a task or a reminder, filed and searchable.",
    does: [
      "Understands what you meant, even when the transcript is messy",
      "Remembers earlier notes, so follow-ups do not start from zero",
      "Asks before anything sensitive and lets you undo the rest",
    ],
    gives: "Nothing you say gets lost in a pile of recordings.",
  },
  paycontrol: {
    label: "Banking backend",
    line: "Lets parents see family spending as it happens and set rules for it, connected to real bank accounts.",
    does: [
      "Pulls in bank transactions through Plaid, safely, without duplicates",
      "Checks every purchase against the parent's spending rules",
      "Alerts parents live and produces reports they can export",
    ],
    gives: "Parents stay in control of spending, with numbers they can trust.",
  },
};

// MOCKUP ONLY, NOT TRUE (Oct 22, 2026): placeholder case for the trucking
// dispatch platform Relja sold, until he gives the real story and numbers.
// Never renders in production.
const MOCK_DISPATCH: AiCase[] =
  true // mocks shown live on Relja's request (Oct 22, 2026)
    ? [
        {
          slug: "pero",
          name: "Pero",
          category: "My AI engineering team",
          headline: "I don't work alone. I built Pero, the system that runs my team of AI agents, so you get a team's output with one senior engineer in charge.",
          summary: "",
          does: [
            "Turns a signed project into a detailed plan, every task with a priority, an effort and a test",
            "Runs a named team of agents in parallel: backend, frontend, security and testers, each in its own copy of the code",
            "Closes nothing without proof from a second agent, and calls my phone only when something is critical",
          ],
          gives: "A team's speed with one senior engineer's standards, around the clock.",
          accent: "#cbb48a",
          href: "/lab/v2/systems/pero",
        },
        {
          slug: "dispatch",
          name: "Dispatch",
          category: "AI truck dispatcher",
          headline: "One dispatcher now runs 15 trucks instead of 8, on a platform I built, sold and still keep secure.",
          summary: "",
          does: [
            "Finds and ranks the best-paying loads for every truck, every few minutes",
            "Drafts rate counter-offers, texts drivers for updates and reads every rate confirmation and BOL",
            "Catches paperwork mismatches and builds detention claims, with a person approving anything sent",
          ],
          gives: "11% more per mile, 18% fewer empty miles, invoices out the same day.",
          accent: "#cbb48a",
          href: "/lab/v2/systems/dispatch",
        },
        {
          slug: "bastion",
          name: "Bastion",
          category: "Private AI model",
          headline: "An AI model trained on the client's own documents, running on their own server. Nothing leaves the building.",
          summary: "",
          does: [
            "Trains an open model (Qwen, Llama) on the client's own documents",
            "Tests every new version against GPT before it replaces the old one",
            "Runs offline on one machine in the client's office, with a cloud model only as backup",
          ],
          gives: "98.6% accuracy where GPT gets 91%, at a fraction of a cent per document.",
          accent: "#cbb48a",
          href: "/lab/v2/systems/bastion",
        },
      ]
    : [];

const REAL_CASES: AiCase[] = ["launchpilot", "deeplead", "supportagent", "voicevault", "paycontrol"].map(
  (slug) => {
    const s = flagshipSystems.find((x) => x.slug === slug)!;
    return {
      slug,
      name: s.name,
      category: PLAIN[slug].label,
      headline: PLAIN[slug].line,
      summary: firstSentence(s.summary),
      does: PLAIN[slug].does,
      gives: PLAIN[slug].gives,
      accent: s.accent,
      href: `/lab/v2/systems/${slug}`,
    };
  },
);

export const aiCases: AiCase[] = [...MOCK_DISPATCH, ...REAL_CASES];

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
  "Most AI tools look great in a demo and break with real customers. I build the part after the demo: a person approves before money moves, every action is recorded, every update is tested, and costs have a hard limit.";

export const LINKS = {
  github: "https://github.com/R3LJA",
  appStore: "https://apps.apple.com/md/developer/relja-bulajic/id1801518678",
};
