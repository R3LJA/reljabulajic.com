// Shape of runs.json: recorded runs of Relja's systems, turned into a static
// trace by a script that reads the source files (see each run's `source`).

export type Actor = "agent" | "rule" | "system" | "human" | "gate";

export type Step = {
  id: string;
  ms?: number | null; // ms since run start, only when the run recorded it
  clock?: string | null; // wall clock from the recording
  dur?: number; // seconds, only when recorded
  actor: Actor;
  tool?: string;
  title: string;
  detail?: string[];
  flag?: "warn" | "block" | null;
  kind?: "approval";
  who?: string;
  role?: string;
  recorded?: string;
};

export type AuditLine = { clock: string; actor: Actor; text: string; after: string };

export type Run = {
  id: string;
  tab: string;
  tabMeta: string;
  system: string;
  recorded: string;
  timing: "real" | "none";
  speed: number;
  model: string;
  source: string;
  synthetic: string;
  input: { title: string; note: string; items: { name: string; meta: string; flag?: "warn" | null }[] };
  steps: Step[];
  result: {
    stats: { label: string; value: string; note: string }[];
    findings: { route: string; title: string }[];
    message: { subject: string; body: string } | null;
    outcome: string;
    audit: AuditLine[];
  };
};

export type RunsFile = { generated: string; runs: Run[] };
