import type { CaseStudy } from "./cases";

// MOCKUP ONLY, NOT TRUE (Oct 22, 2026): Pero is Relja's real agent development
// environment (Workspace: native app, agents per project, teams with roles,
// worktree per agent, verify hook, fuel brake, Pero session with voice). The
// orchestrator-per-project chat, task board, Claude/Codex routing, 12 parallel
// agents, the 24/7 local model and the phone call are the plan in
// workspace/docs/pero-orkestrator-vizija.md, not built yet. Numbers invented.
export const PERO_MOCK: CaseStudy = {
  slug: "pero",
  name: "Pero",
  category: "My AI engineering team",
  headline: "I don't work alone. I built Pero, the system that runs my team of AI agents, so you get a team's output with one senior engineer in charge.",
  summary:
    "Pero is the agent development environment I built for myself, a native macOS app where every client project runs. I talk to one orchestrator. It plans the work, hands it to a team of specialised agents, checks everything they ship and only interrupts me when a decision is really mine.",
  ownership:
    "Designed and built alone: the native app, the agent runtime, the project memory and the orchestrator. I use it every day on client work.",
  accent: "#cbb48a",
  metrics: [
    { value: "12", label: "agents working in parallel" },
    { value: "1", label: "chat to run a whole project" },
    { value: "0", label: "tasks closed without proof" },
    { value: "24/7", label: "on watch, calls me if critical" },
  ],
  architecture: [
    {
      title: "One orchestrator per project",
      body: "I write to one chat. Pero turns it into a plan, starts the right agents, groups them by role and pauses them when something needs me.",
    },
    {
      title: "A team with real roles",
      body: "Every agent has a role, rules and its own tools. The security agent cannot deploy, testers cannot change code, and each one works in its own copy of the repository.",
    },
    {
      title: "Memory that never gets mixed up",
      body: "Knowledge lives in Markdown in git, task state in a database with locks. Twelve agents can work at once without overwriting each other, and every project leaves reusable patterns for the next one.",
    },
  ],
  flow: ["Brief", "Plan", "Build", "Prove", "Route", "Watch"],
  decisions: [
    {
      title: "Done means proven",
      body: "A different agent, starting from a clean context, runs the real app and attaches the proof: test log, screenshot or recording. Without it, the task stays open.",
    },
    {
      title: "The right model for every task",
      body: "Claude plans, designs and reviews. Heavy backend work goes to Codex at high effort, small fixes to a fast model. Every task records model, cost and whether it passed first time, so the routing gets better with each project.",
    },
    {
      title: "Wake me only when it matters",
      body: "A local model watches every project around the clock. It fixes what it safely can, and calls my phone only for something critical. Anything that reaches a client or costs money still goes through me.",
    },
  ],
  stack: ["Claude Opus", "Codex (GPT)", "Local LLM", "Whisper on device", "Rust", "Tauri", "React", "SQLite", "Git worktrees", "MCP", "Twilio Voice"],
  evidence: "",
  problem:
    "One engineer can only type so fast. The usual answer is a bigger team, which brings meetings, handoffs and mistakes nobody owns. What clients actually want is both: the speed of a team and the care of one senior person who answers for every line.",
  steps: [
    "A client signs. I tell Pero everything in one chat: what we agreed, deadlines, constraints. Pero writes the brief and asks about anything missing.",
    "Pero writes a detailed plan: phases, tasks, acceptance criteria and a test after every feature, each with priority and effort. I approve it before any code is written.",
    "Pero starts a named team: backend, frontend, Mirko on security and three testers. Each agent works in its own copy of the code, so nobody steps on anyone.",
    "Every feature is tested by an agent that never saw the code, on the real app. No proof, no done, and failures go straight back with the evidence.",
    "Each task goes to the model that fits it, with live cost tracking and a hard brake before the budget runs out.",
    "At 3 a.m. a payment webhook fails. Pero's local model fixes it, re-runs the tests and logs it. If it can't, my phone rings.",
  ],
  film: "pero",
};
