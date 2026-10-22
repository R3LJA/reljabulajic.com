import type { CaseStudy } from "./cases";

// MOCKUP ONLY, NOT TRUE (Oct 22, 2026): placeholder case study for the truck
// dispatch platform Relja sold. The buyer is never named. Every number here is
// invented for layout until he gives the real ones. Never used in production.
export const DISPATCH_MOCK: CaseStudy = {
  slug: "dispatch",
  name: "Dispatch",
  category: "AI truck dispatcher",
  headline: "One dispatcher now runs 15 trucks instead of 8, on a platform I built, sold and still keep secure.",
  summary:
    "Dispatch is a trucking dispatch platform I built and sold to a US dispatch company. After the sale they came back and paid for AI agents that find better loads, handle broker and driver back-and-forth, and turn paperwork into paid invoices the same day.",
  ownership:
    "Built end to end and sold. I still run its servers, security and updates, and I designed and shipped the AI agents as a paid add-on after the sale.",
  accent: "#cbb48a",
  metrics: [
    { value: "8 → 15", label: "trucks per dispatcher" },
    { value: "+11%", label: "pay per mile" },
    { value: "−18%", label: "empty miles" },
    { value: "Same day", label: "invoicing, was 3 days" },
  ],
  architecture: [
    {
      title: "Five agents, one dispatcher",
      body: "Separate agents for loads, broker offers, driver check-ins, paperwork and detention, each with one job and its own checks.",
    },
    {
      title: "A person approves what matters",
      body: "Nothing goes to a broker and no money moves until the dispatcher approves. Routine updates run on their own.",
    },
    {
      title: "Reads the real paperwork",
      body: "Rate confirmations, bills of lading and delivery photos are read, filed and compared, so a $200 mistake is caught before the invoice goes out.",
    },
  ],
  flow: ["Scan load boards", "Rank loads per truck", "Counter-offer", "Driver check-ins", "Paperwork check", "Bill detention"],
  decisions: [
    {
      title: "Suggest, don't book",
      body: "The agent ranks and drafts, the dispatcher clicks. Dispatchers trusted it in the first week because it never acted behind their back.",
    },
    {
      title: "Every number has a source",
      body: "Each ranking shows why: pay per mile, miles empty to pickup, driver hours left. If a dispatcher disagrees, they can see exactly where.",
    },
    {
      title: "Hard limit on AI cost",
      body: "A monthly ceiling the system cannot pass, and a backup AI provider if one goes down mid-shift.",
    },
  ],
  stack: ["Claude", "OpenAI", "Load board APIs", "Twilio SMS", "ELD and GPS feeds", "Document AI", "PostgreSQL", "Factoring export"],
  evidence: "",
  problem:
    "A dispatcher spends the day on load boards, broker calls, driver texts and paperwork. Around eight trucks they run out of hours, and money leaks quietly: empty miles, waiting time nobody billed, invoices sent days late.",
  steps: [
    "Every few minutes the agent reads the load boards for every truck that is about to be empty.",
    "Each load is scored for that truck: pay per mile, empty miles to pickup, driver hours left and getting the driver home on time.",
    "For the load the dispatcher picks, it drafts a counter-offer from what that lane really paid. Nothing is sent until the dispatcher approves.",
    "It texts drivers for their ETA, updates the load and warns the broker early when a truck runs late.",
    "It reads the rate confirmation, bill of lading and delivery photo, and catches mismatches before the invoice goes out the same day.",
    "GPS arrival and departure times turn waiting into a detention claim with proof, and every action is recorded.",
  ],
  film: "dispatch",
};
