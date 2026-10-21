export type ClientReview = {
  /** Verbatim from Upwork. Trimming with "…" is fine, rewording is not. */
  quote: string;
  /** Client name exactly as Upwork shows it, e.g. "Michael R." */
  client: string;
  /** Upwork contract title, verbatim. */
  project: string;
  /** Upwork feedback score, 1 to 5. */
  score: number;
  /** Contract dates, ISO yyyy-mm-dd. */
  start: string;
  end: string;
  /** Upwork endorsement badges the client picked, if any. */
  endorsements?: string[];
  /** Slug of the matching case study in apps.ts, rendered as /work/<slug>. */
  caseStudy?: string;
  /** Per-review Upwork share link. Falls back to UPWORK_PROFILE_URL. */
  verifyUrl?: string;
};

export const UPWORK_PROFILE_URL =
  "https://www.upwork.com/freelancers/~011b06c043368ef973";

// Newest and strongest first. Only reviews with a written comment.
export const reviews: ClientReview[] = [
  {
    quote:
      "Relja did a great job! He communicated clearly and highlighted early functional trade-offs. He also dived deep into understanding the underlying idea and approach and did not shy away from a very respectful discussion. All this did help the project because of increased decision quality and speed. I really enjoyed working with Relja and will hire him for my next project.",
    client: "Michael R.",
    project: "iOS Developer Needed for Voice-First AI Task Manager (MVP/PoC)",
    score: 5,
    start: "2026-02-26",
    end: "2026-10-08",
    endorsements: [
      "Committed to Quality",
      "Clear Communicator",
      "Accountable for Outcomes",
    ],
    caseStudy: "ryse",
  },
  {
    quote:
      "Relja is transparent, honest, and truly proactive — he doesn’t just execute tasks, he thinks ahead and brings great ideas to the table. Working with him is both efficient and inspiring. Clear communication, high reliability, and genuine passion for quality work. Highly recommended!",
    client: "Hendrik S.",
    project: "Firebase Integration for SwiftUI Photo App (Realtime Chat, Storage, Auth)",
    score: 5,
    start: "2025-04-13",
    end: "2025-10-10",
    endorsements: ["Clear Communicator", "Reliable", "Committed to Quality", "Professional", "Solution Oriented"],
  },
  {
    quote:
      "Relja was fantastic to work with! He delivered clean, efficient code, followed every design spec perfectly, and communicated clearly throughout the project. His speed and attention to detail truly stood out. Highly recommended for any iOS development work.",
    client: "Hrvoje L.",
    project: "Cordova app building and publishing (for iOS)",
    score: 5,
    start: "2025-03-26",
    end: "2025-04-07",
    endorsements: ["Collaborative", "Committed to Quality", "Detail Oriented", "Clear Communicator"],
  },
  {
    quote:
      "Great experience working with Relja. The handover was fast, clean, and professional. He communicated clearly and delivered exactly what was promised. Highly recommend him if you’re looking for high-quality ready-made apps.",
    client: "Sameh M.",
    project: "Looking to Acquire Ready-Made Mobile Apps – iOS/Android – All Categories Welcome",
    score: 5,
    start: "2025-06-16",
    end: "2025-06-16",
    endorsements: ["Collaborative", "Clear Communicator", "Reliable", "Professional", "Committed to Quality"],
  },
  {
    quote:
      "Relja is a great professional. He communicated well along the way and helped me a lot to resolve the issue I was facing. Thanks, Relja!",
    client: "AI Group",
    project: "iOS Developer for a small task required",
    score: 5,
    start: "2025-03-18",
    end: "2025-04-08",
    endorsements: ["Professional", "Clear Communicator", "Solution Oriented"],
  },
];

/** Ratings without a written comment, so the full record can be shown. */
export const ratingOnly: Omit<ClientReview, "quote" | "client">[] = [
  {
    project: "Update ios application, UI and additional UX, Based off Figma file",
    score: 5,
    start: "2025-08-13",
    end: "2026-07-09",
    endorsements: ["Clear Communicator", "Accountable for Outcomes", "Detail Oriented"],
  },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "Feb to Oct 2026", "Aug 2025 to Jul 2026", or "Jun 2025". */
export function formatReviewDates(start: string, end: string): string {
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  const s = MONTHS[sm - 1];
  const e = MONTHS[em - 1];
  if (sy === ey && sm === em) return `${s} ${sy}`;
  if (sy === ey) return `${s} to ${e} ${ey}`;
  return `${s} ${sy} to ${e} ${ey}`;
}
