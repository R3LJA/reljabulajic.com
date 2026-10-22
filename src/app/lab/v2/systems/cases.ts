import { flagshipSystems, type AiSystem } from "@/lib/aiSystems";
import { PLAIN } from "../data";
import { BASTION_MOCK } from "./bastionMock";
import { DISPATCH_MOCK } from "./dispatchMock";

// Case-study copy for /lab/v2/systems. Everything is rewritten from the facts
// in lib/aiSystems.ts: no new numbers, clients or results.

export type CaseExtra = {
  /** One-paragraph problem, in the buyer's words. */
  problem: string;
  /** One line per flow step, same order as AiSystem.flow. */
  steps: string[];
  /** The film behind the opening screen. */
  film: string;
};

const EXTRA: Record<string, CaseExtra> = {
  launchpilot: {
    problem:
      "Growth work is research, writing, review, scheduling and publishing, spread across many tools and many model providers. A content wrapper breaks the first time a provider times out or a social token expires.",
    steps: [
      "Research and strategy start the run, so every piece of work begins from a brief, not a blank prompt.",
      "A custom orchestrator and Anthropic tool loop break the work into tasks and run them as long-lived jobs.",
      "Each task goes to the model that fits it: Claude, OpenAI, Gemini or Grok, with a fallback when one fails.",
      "Output passes review and policy gates before anything leaves the system.",
      "Approved work is published on schedule through authenticated social integrations.",
      "Every job reports its state, so failures are visible and retried in a controlled way.",
    ],
    film: "launchpilot",
  },
  deeplead: {
    problem:
      "Sales research is slow when a person does it and unreliable when one general agent does it: it guesses, it repeats itself, and nobody can tell which claim came from where.",
    steps: [
      "The ideal customer profile becomes the brief every agent works from.",
      "Specialized agents research companies and people across multiple public sources.",
      "Identity resolution makes sure the person and company found are the right ones.",
      "A semantic critic checks each claim against its sources before it is trusted.",
      "Fit and risk are scored, with the evidence attached to every score.",
      "Outreach is activated under control: policy, cost limits and quality gates come first.",
    ],
    film: "deeplead",
  },
  supportagent: {
    problem:
      "An AI that answers every support message will eventually promise a refund it should not, or answer a bug it does not understand. Answering everything by hand does not scale across several apps.",
    steps: [
      "Chat and email arrive in one place, across several products.",
      "The agent sees who is writing: app version, device and subscription tier.",
      "Answers are grounded in that app's own knowledge base, kept separate per product.",
      "Claude returns a structured decision: confidence, category, sentiment and a summary.",
      "Routine questions are answered; refunds, unknown bugs and frustration go to a person.",
      "Operator corrections are captured and turned into suggested knowledge-base fixes.",
    ],
    film: "supportagent",
  },
  voicevault: {
    problem:
      "Speech-to-text leaves you with a pile of transcripts. What people actually need is the note filed, the reminder set and the decision remembered, from one sentence said out loud.",
    steps: [
      "Voice is captured in a progressive web app, anywhere.",
      "Transcription is repaired before anything depends on it.",
      "Intent and entities turn the sentence into a structured command.",
      "Conversational memory resolves references to earlier notes and context.",
      "A single action layer runs the tool, with confirmation for sensitive actions and an undo for fast ones.",
      "The result becomes searchable memory, not a folder of audio files.",
    ],
    film: "voicevault",
  },
  paycontrol: {
    problem:
      "Family money needs real-time visibility and rules a parent can trust. Bank webhooks arrive twice, arrive late or fail halfway, and none of that is allowed to create a wrong transaction or a false alert.",
    steps: [
      "Plaid webhooks report new bank activity.",
      "Sync is idempotent: retries and duplicates cannot create duplicate records.",
      "Transactions land in a migration-backed ledger, the single source of truth.",
      "Spending rules are evaluated in the backend, so every client gets the same decision.",
      "Parents are notified live through server-sent events.",
      "PDF and JSON reports make every outcome exportable and auditable.",
    ],
    film: "paycontrol",
  },
};

export type CaseStudy = AiSystem & CaseExtra;

const MOCK = true; // mocks shown live on Relja's request (Oct 22, 2026)

export const caseOrder = [...(MOCK ? ["dispatch", "bastion"] : []), "launchpilot", "deeplead", "supportagent", "voicevault", "paycontrol"];

export function getCase(slug: string): CaseStudy | undefined {
  if (MOCK && slug === "dispatch") return DISPATCH_MOCK;
  if (MOCK && slug === "bastion") return BASTION_MOCK;
  const base = flagshipSystems.find((s) => s.slug === slug);
  const extra = EXTRA[slug];
  if (!base || !extra) return undefined;
  // plain-language name and one-liner in place of the technical ones
  return { ...base, ...extra, category: PLAIN[slug].label, headline: PLAIN[slug].line };
}

export function nextCase(slug: string): CaseStudy {
  const i = caseOrder.indexOf(slug);
  return getCase(caseOrder[(i + 1) % caseOrder.length])!;
}
