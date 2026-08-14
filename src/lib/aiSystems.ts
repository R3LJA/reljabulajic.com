export type AiSystem = {
  slug: string;
  name: string;
  category: string;
  headline: string;
  summary: string;
  ownership: string;
  accent: string;
  metrics: { value: string; label: string }[];
  architecture: { title: string; body: string }[];
  flow: string[];
  decisions: { title: string; body: string }[];
  stack: string[];
  evidence: string;
};

export const flagshipSystems: AiSystem[] = [
  {
    slug: "launchpilot",
    name: "LaunchPilot",
    category: "Multi-model agent platform",
    headline: "An AI growth operating system, not a content wrapper.",
    summary:
      "LaunchPilot coordinates research, generation, review, scheduling and publishing across a large multi-model system. It combines a custom Anthropic tool loop with production integrations, scheduled jobs, fallbacks and observability so the product can keep operating when providers or external APIs fail.",
    ownership:
      "Independently architected and implemented end to end, including product architecture, agent orchestration, application code, data model, integrations, billing, deployment and production controls.",
    accent: "#7DB8E8",
    metrics: [
      { value: "57", label: "AI modules" },
      { value: "86", label: "API routes" },
      { value: "15", label: "scheduled jobs" },
      { value: "21", label: "database migrations" },
    ],
    architecture: [
      {
        title: "Custom agent runtime",
        body: "A purpose-built orchestrator and Anthropic tool loop coordinate model calls, tools and long-running workflows instead of relying on a single prompt-response endpoint.",
      },
      {
        title: "Multi-provider resilience",
        body: "Claude, OpenAI, Gemini and Grok are routed by task, with fallback paths that protect critical workflows from provider-specific failures.",
      },
      {
        title: "Operational automation",
        body: "Authenticated social integrations, scheduled publishing and background jobs turn generated output into a complete production workflow.",
      },
      {
        title: "Production control plane",
        body: "Observability, failure handling, OAuth, Stripe and persistent job state make agent behavior measurable and recoverable after deployment.",
      },
    ],
    flow: [
      "Strategy & research",
      "Agent orchestration",
      "Model routing",
      "Review & policy gates",
      "Scheduled publishing",
      "Telemetry & recovery",
    ],
    decisions: [
      {
        title: "Models are infrastructure",
        body: "Each provider is treated as a replaceable capability with explicit routing and fallback behavior, not as the application architecture itself.",
      },
      {
        title: "Long-running work needs state",
        body: "Publishing and research workflows are represented as observable jobs so retries are controlled and failures are visible.",
      },
      {
        title: "Integrations define reliability",
        body: "OAuth expiry, rate limits, partial success and provider downtime are designed into the workflow rather than handled as edge cases later.",
      },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Anthropic",
      "OpenAI",
      "Gemini",
      "Grok",
      "Stripe",
      "OAuth",
      "Vercel Cron",
    ],
    evidence:
      "Private product repository. Architecture facts are derived from the route tree, AI modules, migrations and production job definitions.",
  },
  {
    slug: "deeplead",
    name: "DeepLead",
    category: "Agentic sales intelligence",
    headline: "Eighteen specialized agents turning an ICP into evidence-backed action.",
    summary:
      "DeepLead researches companies and people, triangulates public information, scores fit and coordinates safe outreach through specialized agents. The system includes model policy, evaluation gates and cost governance so intelligence quality can improve without making production behavior unpredictable.",
    ownership:
      "Independently architected and implemented across the agent system, Next.js application, Supabase data layer, evaluation pipeline, cost controls, testing and production rollout.",
    accent: "#A78BFA",
    metrics: [
      { value: "18", label: "specialized agents" },
      { value: "42", label: "API routes" },
      { value: "40+", label: "automated tests" },
      { value: "4", label: "quality-gate stages" },
    ],
    architecture: [
      {
        title: "Specialized agent graph",
        body: "Research, enrichment, scoring, critique and outreach responsibilities are separated into bounded modules rather than collapsed into one general agent.",
      },
      {
        title: "Evidence triangulation",
        body: "Claims are assembled from multiple sources and passed through semantic critique before they become operational recommendations.",
      },
      {
        title: "Policy-based routing",
        body: "Claude Agent SDK and OpenAI capabilities are selected through task policies that account for quality, latency and cost.",
      },
      {
        title: "Evaluation-driven rollout",
        body: "Intelligence gates, chat A/B evaluation, automated tests and production-readiness checks protect releases from silent quality regressions.",
      },
    ],
    flow: [
      "ICP definition",
      "Multi-source research",
      "Identity resolution",
      "Semantic critic",
      "Fit & risk scoring",
      "Controlled activation",
    ],
    decisions: [
      {
        title: "Boundaries beat agent drift",
        body: "Each agent owns a narrow contract, making routing explainable and failures easier to isolate and evaluate.",
      },
      {
        title: "Cost is a product constraint",
        body: "A cost governor and model policies keep higher-capability inference focused on the stages where it changes the result.",
      },
      {
        title: "Quality needs executable gates",
        body: "Prompt quality is backed by automated evaluation and rollout checks instead of relying on manual spot checks alone.",
      },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Claude Agent SDK",
      "Anthropic",
      "OpenAI",
      "Vitest",
      "Playwright",
      "Vercel",
    ],
    evidence:
      "Private product repository. Architecture facts are derived from its 42 route handlers, specialized agent modules and executable quality-gate pipeline.",
  },
  {
    slug: "paycontrol",
    name: "PayControl",
    category: "Python fintech backend",
    headline: "A complete banking and spending-policy backend built from the ground up.",
    summary:
      "PayControl gives parents real-time visibility and policy control over family spending. Its backend covers authentication, banking synchronization, transaction processing, rule evaluation, live events, reporting and the operational safeguards required around financial data.",
    ownership:
      "I independently designed and built the complete Python backend: API architecture, PostgreSQL model, Plaid integration, rules engine, security, scheduled processing, reporting, tests and deployment infrastructure.",
    accent: "#FBBF24",
    metrics: [
      { value: "50", label: "FastAPI endpoints" },
      { value: "36", label: "automated tests" },
      { value: "6", label: "Alembic migrations" },
      { value: "24/7", label: "event-driven backend" },
    ],
    architecture: [
      {
        title: "Banking synchronization",
        body: "Plaid transaction sync uses encrypted access tokens, retry behavior and idempotent processing to handle duplicate and partial events safely.",
      },
      {
        title: "Policy engine",
        body: "Configurable spending rules evaluate transaction behavior and produce violations and notifications without coupling policy logic to the client apps.",
      },
      {
        title: "Live operational events",
        body: "Server-sent events and scheduled processing keep clients current while preserving a clear backend source of truth.",
      },
      {
        title: "Auditable reporting",
        body: "PDF and structured JSON reports provide exportable outcomes over a migration-backed PostgreSQL domain model.",
      },
    ],
    flow: [
      "Plaid webhooks",
      "Idempotent sync",
      "Transaction ledger",
      "Rules evaluation",
      "Live notifications",
      "Reports & audit",
    ],
    decisions: [
      {
        title: "Financial events must be idempotent",
        body: "Retries and duplicate webhooks cannot create duplicate transactions or violations, so sync state is explicit and recoverable.",
      },
      {
        title: "Secrets stay encrypted",
        body: "Plaid access tokens and sensitive configuration are isolated behind the backend rather than exposed to product clients.",
      },
      {
        title: "Policy belongs in the domain layer",
        body: "Spending rules are modeled as testable backend behavior so iOS and future clients consume the same decisions.",
      },
    ],
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "SQLAlchemy",
      "Alembic",
      "Plaid",
      "APScheduler",
      "SSE",
      "Docker",
      "Render",
      "Pytest",
    ],
    evidence:
      "Private product repository. Architecture facts are derived from the Python API, service layer, database migrations and automated backend test suite.",
  },
  {
    slug: "voicevault",
    name: "VoiceVault",
    category: "Voice-first agent system",
    headline: "Voice becomes structured memory, actions and an agent conversation.",
    summary:
      "VoiceVault is a voice-first web application that turns spoken input into searchable notes, tasks, reminders, decisions and contextual agent actions. It combines transcription, structured extraction, conversational memory and tool execution rather than stopping at speech-to-text.",
    ownership:
      "Independently designed and implemented across the voice experience, agent behavior, transcription and extraction pipelines, memory system, search, API surface, data model and progressive web application.",
    accent: "#6EE7B7",
    metrics: [
      { value: "46", label: "API routes" },
      { value: "44", label: "AI & voice modules" },
      { value: "100+", label: "voice intents" },
      { value: "1", label: "unified action layer" },
    ],
    architecture: [
      {
        title: "Voice understanding pipeline",
        body: "Transcription is corrected, classified and transformed into structured intent before downstream tools or storage are invoked.",
      },
      {
        title: "Conversational memory",
        body: "Multi-turn context connects references, prior notes and the current action so follow-up commands do not restart from zero.",
      },
      {
        title: "Tool-routed actions",
        body: "A capability layer covers note operations, reminders, search, summaries, pattern analysis and suggestions with confirmation policies for sensitive actions.",
      },
      {
        title: "Searchable personal knowledge",
        body: "Structured extraction and semantic retrieval make voice history queryable as memory, not just a folder of audio files.",
      },
    ],
    flow: [
      "Voice capture",
      "Transcription repair",
      "Intent & entities",
      "Context resolution",
      "Tool execution",
      "Memory & feedback",
    ],
    decisions: [
      {
        title: "Transcription is only stage one",
        body: "The product value comes from turning speech into reliable structure and actions, not from producing a text blob.",
      },
      {
        title: "Fast paths need safe undo",
        body: "Low-risk voice commands can execute immediately while confirmation policies and an undo layer protect consequential actions.",
      },
      {
        title: "Memory must remain useful",
        body: "Context selection and semantic retrieval keep relevant history available without continually expanding the model context window.",
      },
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "OpenAI",
      "Whisper",
      "Supabase",
      "PostgreSQL",
      "Embeddings",
      "NextAuth",
      "Vitest",
      "PWA",
    ],
    evidence:
      "Private product repository. Architecture facts are derived from 46 route handlers and the implemented AI, voice, memory and tool modules.",
  },
  {
    slug: "supportagent",
    name: "SupportAgent",
    category: "Autonomous customer operations",
    headline:
      "An AI support team that knows exactly when it needs a human.",
    summary:
      "SupportAgent monitors customer conversations across multiple products, grounds responses in each app's knowledge base and routes every case by confidence, sentiment and policy. Routine questions can be handled immediately while refunds, unknown bugs and sensitive situations enter a native human-review queue with full context.",
    ownership:
      "Independently designed and implemented across the Claude agent, prompt and escalation architecture, Supabase backend, email ingestion, multi-app knowledge model, realtime events and native macOS operator dashboard.",
    accent: "#38BDF8",
    metrics: [
      { value: "Multi-app", label: "isolated knowledge bases" },
      { value: "<0.5", label: "confidence escalation" },
      { value: "6", label: "explicit safety triggers" },
      { value: "Realtime", label: "native operator queue" },
    ],
    architecture: [
      {
        title: "Context-grounded responder",
        body: "The Claude agent receives conversation history, app-specific knowledge and product metadata such as version, device and subscription tier before producing a response.",
      },
      {
        title: "Structured decision output",
        body: "Every answer includes confidence, category, sentiment, escalation state and a concise issue summary, turning model output into an operational decision.",
      },
      {
        title: "Risk-based human handoff",
        body: "Refunds, low confidence, unknown bugs, user frustration, repeated failure and explicit human requests bypass autonomous resolution.",
      },
      {
        title: "Learning from corrections",
        body: "Operator overrides are captured as correction signals and aggregated into suggested knowledge-base improvements for future conversations.",
      },
    ],
    flow: [
      "Chat & email",
      "User context",
      "Knowledge retrieval",
      "Claude decision",
      "Auto-reply or review",
      "Learning loop",
    ],
    decisions: [
      {
        title: "Autonomy is conditional",
        body: "The agent earns the right to respond from grounding, confidence and policy checks. Sensitive categories do not become autonomous because the wording sounds certain.",
      },
      {
        title: "Escalation carries context",
        body: "The operator receives the complete thread, AI summary and suggested response so human review is a fast continuation rather than a workflow restart.",
      },
      {
        title: "One system, multiple products",
        body: "Each app keeps separate knowledge and identity while the operator gets one shared support surface across the complete product portfolio.",
      },
    ],
    stack: [
      "Claude",
      "Production prompting",
      "Supabase",
      "PostgreSQL",
      "Edge Functions",
      "TypeScript",
      "Resend",
      "Realtime",
      "SwiftUI",
      "macOS",
      "Vitest",
    ],
    evidence:
      "Private product repository. Architecture facts are derived from the implemented agent, email webhook, realtime macOS client and detailed behavioral specifications.",
  },
];

export function getAiSystem(slug: string) {
  return flagshipSystems.find((system) => system.slug === slug);
}
