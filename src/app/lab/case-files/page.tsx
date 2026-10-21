import type { Metadata } from "next";
import Image from "next/image";
import CoverVideo from "./CoverVideo";
import Scrubber from "./Scrubber";
import ReplayStep from "./ReplayStep";
import trace from "./intake-trace.json";

// Prototype B, "Case Files". Every figure on this page comes from a recorded
// run, a repo on Relja's machine or a public page, as listed in
// research/25-ai-engineer/proof-inventory.md. The intake replay is built from
// ophand/public/demo-runs/kessler.json (recorded Oct 8, 2026, synthetic client).

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Case Files, Edition 2026.10 | Relja Bulajić",
  description:
    "Forward deployed AI engineer for agents that touch real money and real customers. Case files with recorded runs, plus iOS apps shipped solo.",
  robots: { index: false, follow: false },
};

const UPWORK_PROFILE_URL =
  "https://www.upwork.com/freelancers/~011b06c043368ef973";
const DEVELOPER_PAGE =
  "https://apps.apple.com/us/developer/relja-bulajic/id1801518678";

type ShelfApp = {
  id: string;
  name: string;
  slug: string;
  kind: string;
  line: string;
  detail: string;
  url: string;
};

const SHELF: ShelfApp[] = [
  {
    id: "6749489000",
    name: "AirPosture",
    slug: "airposture",
    kind: "Health, iPhone and Mac",
    line: "Your AirPods become a posture sensor.",
    detail:
      "Head motion from AirPods drives an adaptive voice coach. A simulator release gate replays 13 scripted sessions, from a first session to afternoon fatigue, and blocks any archive unless every one passes.",
    url: "https://apps.apple.com/us/app/sit-straight-airposture/id6749489000",
  },
  {
    id: "6766129301",
    name: "Vael",
    slug: "vael",
    kind: "Lifestyle",
    line: "An AI wardrobe with virtual try-on.",
    detail:
      "15 AI features are metered for cost on the server, and API keys never ship in the app.",
    url: "https://apps.apple.com/us/app/ai-wardrobe-try-on-vael/id6766129301",
  },
  {
    id: "6759579263",
    name: "Recite",
    slug: "recite",
    kind: "Education",
    line: "Explain it out loud, get quizzed by voice.",
    detail:
      "Screen Time shields lock distracting apps until the study session is done.",
    url: "https://apps.apple.com/us/app/recite-voice-study-ai/id6759579263",
  },
  {
    id: "6756668065",
    name: "Gut",
    slug: "gut",
    kind: "Lifestyle",
    line: "A journal that sees relationship patterns.",
    detail:
      "Each logged moment is classified and read for patterns across weeks.",
    url: "https://apps.apple.com/us/app/gut-relationship-red-flags/id6756668065",
  },
];

async function lookupIcons(ids: string[]): Promise<Map<string, string>> {
  const byId = new Map<string, string>();
  try {
    const res = await fetch(
      `https://itunes.apple.com/lookup?id=${ids.join(",")}&country=us`,
      {
        next: { revalidate: 86400 },
      },
    );
    if (!res.ok) return byId;
    const data = (await res.json()) as {
      results?: { trackId: number; artworkUrl512?: string }[];
    };
    for (const r of data.results ?? []) {
      if (r.artworkUrl512) byId.set(String(r.trackId), r.artworkUrl512);
    }
  } catch {
    // Icons are decoration; the shelf falls back to a letter.
  }
  return byId;
}

const INDEX = [
  {
    no: "01",
    title: "The checklist that reads last year's return",
    field: "Tax intake agent, US accounting",
    figure: "8 of 8",
    figureNote: "planted issues caught",
    date: "Oct 8, 2026",
    href: "#file-01",
  },
  {
    no: "02",
    title: "Every write waits for a signature",
    field: "Gatehouse MCP, open source",
    figure: "13 of 13",
    figureNote: "red-team attacks blocked",
    date: "Oct 13, 2026",
    href: "#file-02",
  },
  {
    no: "03",
    title: "No release until the simulator agrees",
    field: "AirPosture eval gate, iOS",
    figure: "13",
    figureNote: "scenarios gate each archive",
    date: "Sep 21 to Oct 17, 2026",
    href: "#file-03",
  },
  {
    no: "04",
    title: "The cockpit I run my agents from",
    field: "Workspace, agent infrastructure",
    figure: "15 days",
    figureNote: "73 commits, used daily",
    date: "Sep 25 to Oct 9, 2026",
    href: "#file-04",
  },
];

function Reg({ className }: { className: string }) {
  return (
    <svg
      className={`cf-reg ${className}`}
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="5" />
      <path d="M10 0v20M0 10h20" />
    </svg>
  );
}

const STATUS_LABEL: Record<string, string> = {
  received: "Received",
  missing: "Missing",
  open: "Open",
};

function BeforePanel() {
  const uploads = trace.reads.map((r) => r.file);
  return (
    <div className="cf-panel cf-before">
      <div className="cf-panel-head">
        <span className="cf-kicker">Before</span>
        <span className="cf-panel-title">The upload folder</span>
      </div>
      <div className="cf-desk">
        <div className="cf-stack">
          <span className="cf-stack-label">return-2025.pdf</span>
          <span className="cf-stack-sub">last year, 5 source documents</span>
        </div>
        {uploads.map((f, i) => (
          <div key={f} className={`cf-paper cf-paper-${i}`}>
            <span className="cf-paper-ext">PDF</span>
            <span className="cf-paper-name">{f}</span>
          </div>
        ))}
        <p className="cf-margin-q cf-q-0">Is this the 2026 W-2?</p>
        <p className="cf-margin-q cf-q-1">Did the brokerage send one?</p>
        <p className="cf-margin-q cf-q-2">Who is the new lender?</p>
      </div>
      <p className="cf-panel-foot">
        Five uploads named by the client, compared by hand against last year’s
        return. Nothing says what is still missing.
      </p>
    </div>
  );
}

function AfterPanel() {
  return (
    <div className="cf-panel cf-after">
      <div className="cf-panel-head">
        <span className="cf-kicker cf-kicker-accent">After</span>
        <span className="cf-panel-title">The reconciled checklist</span>
      </div>
      <ol className="cf-check">
        {trace.checklist.map((row) => {
          const wrongYear = row.id === "E2";
          const status = wrongYear
            ? "Wrong year"
            : (STATUS_LABEL[row.status] ?? row.status);
          return (
            <li key={row.id} className="cf-check-row">
              <span className="cf-check-id">{row.id}</span>
              <span className="cf-check-doc">
                <b>{row.form === "Confirm" ? "Confirm" : row.form}</b>{" "}
                {row.payer}
              </span>
              <span
                className={`cf-stamp cf-stamp-${wrongYear ? "missing" : row.status}`}
              >
                {status}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="cf-panel-foot">
        <b>8 of 8</b> planted issues flagged. The client message and the
        preparer note are drafted and wait for approval.
      </p>
    </div>
  );
}

export default async function CaseFilesPage() {
  const icons = await lookupIcons(SHELF.map((a) => a.id));
  const [lead, ...rest] = SHELF;

  return (
    <main className="cf-page">
      <a className="cf-skip" href="#file-01">
        Skip to case file 01
      </a>

      {/* Masthead */}
      <header className="cf-masthead">
        <div className="cf-wrap cf-masthead-row">
          <span className="cf-brand">Case Files</span>
          <nav className="cf-nav" aria-label="Sections">
            <a href="#index">Index</a>
            <a href="#file-01">File 01</a>
            <a href="#shelf">Shelf</a>
            <a href="#close">Close</a>
          </nav>
          <span className="cf-edition">Edition 2026.10</span>
        </div>
      </header>

      {/* Cover */}
      <section className="cf-cover" aria-labelledby="cf-cover-title">
        <Reg className="cf-reg-tl" />
        <Reg className="cf-reg-tr" />
        <div className="cf-wrap cf-cover-grid">
          <div className="cf-cover-meta">
            <span>Belgrade</span>
            <span>Updated Oct 19, 2026</span>
            <span>4 case files, 4 apps</span>
          </div>

          <figure className="cf-cover-video">
            <CoverVideo />
          </figure>

          <div className="cf-cover-copy">
            <p className="cf-byline">
              Relja Bulajić <span aria-hidden="true">/</span> Forward deployed
              AI engineer <span aria-hidden="true">/</span> iOS developer
            </p>
            <h1 id="cf-cover-title" className="cf-cover-title">
              The part after the demo.
            </h1>
            <p className="cf-deck">
              I build AI agents that touch real money and real customers, and
              the parts that make them safe to run: approval gates, an audit
              trail, evals and cost limits. I also ship iOS apps, alone.
            </p>
          </div>

          <div id="index" className="cf-index">
            <div className="cf-index-head">
              <span>In this edition</span>
              <span>Recorded</span>
            </div>
            <ol>
              {INDEX.map((f) => (
                <li key={f.no}>
                  <a href={f.href} className="cf-index-row">
                    <span className="cf-index-no">{f.no}</span>
                    <span className="cf-index-main">
                      <span className="cf-index-title">{f.title}</span>
                      <span className="cf-index-field">{f.field}</span>
                    </span>
                    <span className="cf-index-fig">
                      <b>{f.figure}</b>
                      <span>{f.figureNote}</span>
                    </span>
                    <span className="cf-index-date">{f.date}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href="#shelf" className="cf-index-row cf-index-shelf">
                  <span className="cf-index-no">+</span>
                  <span className="cf-index-main">
                    <span className="cf-index-title">The app shelf</span>
                    <span className="cf-index-field">
                      iOS apps on the App Store, built solo
                    </span>
                  </span>
                  <span className="cf-index-fig">
                    <b>4</b>
                    <span>apps in this issue</span>
                  </span>
                  <span className="cf-index-date">Live now</span>
                </a>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Case file 01 */}
      <article id="file-01" className="cf-spread" aria-labelledby="cf-01-title">
        <div className="cf-wrap">
          <div className="cf-spread-head">
            <span className="cf-bignum" aria-hidden="true">
              01
            </span>
            <div>
              <p className="cf-kicker">
                Case file 01 / Tax intake agent / US accounting
              </p>
              <h2 id="cf-01-title" className="cf-spread-title">
                The checklist that reads last year’s return.
              </h2>
              <p className="cf-standfirst">
                A tax office has to work out which documents each returning
                client still owes. This agent builds the list from last year’s
                IRS return, reads every upload, checks it in code, and drafts
                the chase. A person approves before anything is sent.
              </p>
            </div>
          </div>

          <div className="cf-scrub-block">
            <div className="cf-scrub-caption">
              <span>Drag, or focus the handle and use the arrow keys.</span>
              <span>Synthetic client, recorded Oct 8, 2026</span>
            </div>
            <Scrubber before={<BeforePanel />} after={<AfterPanel />} />
          </div>

          <div className="cf-columns">
            <section className="cf-col">
              <h3 className="cf-col-head">Problem</h3>
              <p>
                Returning clients upload whatever they find, with names like{" "}
                <span className="cf-file">credit union tax form.pdf</span>.
                Someone has to compare each file with last year’s return, spot
                what never arrived, notice the wrong year, and write to the
                client. It is careful, repetitive work, and the misses are what
                cost money later.
              </p>
            </section>

            <section className="cf-col cf-col-wide">
              <h3 className="cf-col-head">Decisions</h3>
              <ol className="cf-decisions">
                <li>
                  <b>The list comes from the real return, not a template.</b>{" "}
                  Every row cites its source, such as “Schedule B line 1”, so
                  the preparer can check it in seconds.
                </li>
                <li>
                  <b>Dates and forms are checked in code.</b> The wrong-year W-2
                  was caught by a plain rule, logged as the rule’s finding, not
                  the model’s guess.
                </li>
                <li className="cf-tradeoff">
                  <span className="cf-tradeoff-tag">Tradeoff</span>
                  <b>Nothing goes out on its own.</b> The agent drafts the
                  client message and the preparer note, and both wait for a
                  person. The office gives up a fully automatic send; in return
                  no client gets a wrong request with the firm’s name on it.
                </li>
              </ol>
            </section>

            <section className="cf-col">
              <h3 className="cf-col-head">Stack</h3>
              <ul className="cf-stack-list">
                <li>Claude with JSON-schema structured outputs</li>
                <li>Rule checks in TypeScript</li>
                <li>Next.js 16, streaming event log</li>
                <li>25 synthetic clients as real IRS PDFs</li>
                <li>Ground-truth scorer per run</li>
              </ul>
            </section>
          </div>

          <ReplayStep />

          <div className="cf-result">
            <h3 className="cf-col-head">Result</h3>
            <dl className="cf-result-grid">
              <div>
                <dt>Planted issues caught</dt>
                <dd>
                  <b>8</b> of 8
                </dd>
              </div>
              <div>
                <dt>Extra flags</dt>
                <dd>
                  <b>1</b> preparer note
                </dd>
              </div>
              <div>
                <dt>Full run, 4 steps</dt>
                <dd>
                  <b>142</b> s
                </dd>
              </div>
              <div>
                <dt>Tokens in / out</dt>
                <dd>
                  <b>68.7k</b> / 13.1k
                </dd>
              </div>
            </dl>
            <p className="cf-honest">
              <b>Honest limit.</b> This score is one client. The 25-client run
              is the next step, and its results table will replace this line.
            </p>
          </div>
        </div>
      </article>

      {/* Briefs: files 02 to 04 */}
      <section className="cf-briefs" aria-labelledby="cf-briefs-title">
        <div className="cf-wrap">
          <div className="cf-briefs-head">
            <h2 id="cf-briefs-title" className="cf-section-title">
              Filed in brief
            </h2>
            <p>Full spreads for these files come in the next edition.</p>
          </div>
          <div className="cf-briefs-grid">
            <article id="file-02" className="cf-brief cf-brief-lead">
              <p className="cf-kicker">File 02 / Oct 13, 2026</p>
              <h3>Every write waits for a signature.</h3>
              <p className="cf-brief-fig">
                <b>13 of 13</b> red-team attacks blocked, <b>72</b> tests
              </p>
              <p>
                Gatehouse is an open-source MCP server. A refund, a discount or
                a customer email is only a proposal until a named person signs
                it with their own key. The approval is bound to a hash of the
                exact arguments, budgets are checked again at execution, and the
                audit log is hash-chained.
              </p>
              <a
                className="cf-link"
                href="https://github.com/R3LJA/gatehouse-mcp"
                target="_blank"
                rel="noreferrer"
              >
                Read the code on GitHub
              </a>
            </article>
            <article id="file-03" className="cf-brief">
              <p className="cf-kicker">File 03 / Sep 21 to Oct 17, 2026</p>
              <h3>No release until the simulator agrees.</h3>
              <p className="cf-brief-fig">
                <b>13</b> scenarios, <b>320</b> recorded runs
              </p>
              <p>
                AirPosture’s gate replays scripted AirPods sessions in the iOS
                simulator and grades each with pass or fail assertions, such as
                “a 22 degree slouch reads as bad”. One failure blocks the
                archive. Evals for agents work the same way.
              </p>
            </article>
            <article id="file-04" className="cf-brief">
              <p className="cf-kicker">File 04 / Sep 25 to Oct 9, 2026</p>
              <h3>The cockpit I run my agents from.</h3>
              <p className="cf-brief-fig">
                <b>73</b> commits in <b>15</b> days, used every day
              </p>
              <p>
                Workspace is a native macOS terminal where Claude Code agents
                work in panes. When an agent says it is done, the project’s
                checks run and a failure sends it back. Teams of agents share an
                approval queue, and I approve, edit or reject the exact text.
                Private repo.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* App shelf */}
      <section id="shelf" className="cf-shelf" aria-labelledby="cf-shelf-title">
        <div className="cf-wrap">
          <div className="cf-shelf-head">
            <p className="cf-kicker">The app shelf</p>
            <h2 id="cf-shelf-title" className="cf-section-title">
              Apps I design, build and ship alone.
            </h2>
          </div>

          <div className="cf-shelf-grid">
            <div className="cf-shelf-lead">
              <div className="cf-device">
                <Image
                  src={`/apps/${lead.slug}/screenshots/01.png`}
                  alt={`${lead.name} home screen`}
                  width={920}
                  height={2000}
                  sizes="(max-width: 700px) 60vw, 300px"
                />
              </div>
              <div className="cf-shelf-lead-copy">
                <ShelfTitle app={lead} icon={icons.get(lead.id) ?? null} big />
                <p className="cf-shelf-line">{lead.line}</p>
                <p className="cf-shelf-detail">{lead.detail}</p>
                <a
                  className="cf-link"
                  href={lead.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on the App Store
                </a>
              </div>
              <dl className="cf-spec">
                <div>
                  <dt>Platforms</dt>
                  <dd>iPhone and Mac</dd>
                </div>
                <div>
                  <dt>In development</dt>
                  <dd>Aug 2025 to today</dd>
                </div>
                <div>
                  <dt>Commits</dt>
                  <dd>375</dd>
                </div>
                <div>
                  <dt>Release gate</dt>
                  <dd>13 scenarios, all must pass</dd>
                </div>
                <div>
                  <dt>Built by</dt>
                  <dd>Relja, alone</dd>
                </div>
              </dl>
            </div>

            <ul className="cf-shelf-row">
              {rest.map((app) => (
                <li key={app.id} className="cf-shelf-item">
                  <div className="cf-device cf-device-sm">
                    <Image
                      src={`/apps/${app.slug}/screenshots/01.png`}
                      alt={`${app.name} screen`}
                      width={920}
                      height={2000}
                      sizes="(max-width: 700px) 40vw, 180px"
                    />
                  </div>
                  <div>
                    <ShelfTitle app={app} icon={icons.get(app.id) ?? null} />
                    <p className="cf-shelf-line">{app.line}</p>
                    <p className="cf-shelf-detail">{app.detail}</p>
                    <a
                      className="cf-link"
                      href={app.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      App Store
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="cf-shelf-more">
            More on my{" "}
            <a href={DEVELOPER_PAGE} target="_blank" rel="noreferrer">
              App Store developer page
            </a>
            .
          </p>
        </div>
      </section>

      {/* Close */}
      <section id="close" className="cf-close" aria-labelledby="cf-close-title">
        <div className="cf-wrap cf-close-grid">
          <p className="cf-kicker cf-kicker-light">The close</p>
          <h2 id="cf-close-title" className="cf-close-title">
            Reply to my proposal on Upwork.
          </h2>
          <div className="cf-close-copy">
            <p>
              You found this edition through my proposal. That thread is where
              we talk: send the workflow your agent has to handle, and I will
              tell you where it needs a gate, a log and an eval.
            </p>
            <a
              className="cf-close-link"
              href={UPWORK_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
            >
              My Upwork profile <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="cf-wrap cf-colophon">
          <span>Case Files, Edition 2026.10. Relja Bulajić, Belgrade.</span>
          <span>
            Every figure comes from a recorded run, a repo or a public page.
            Replays use synthetic clients.
          </span>
        </div>
      </section>
    </main>
  );
}

function ShelfTitle({
  app,
  icon,
  big = false,
}: {
  app: ShelfApp;
  icon: string | null;
  big?: boolean;
}) {
  return (
    <div className={`cf-shelf-title ${big ? "cf-shelf-title-big" : ""}`}>
      {icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={icon}
          alt=""
          width={big ? 64 : 44}
          height={big ? 64 : 44}
          decoding="async"
          className="cf-icon"
        />
      ) : (
        <span className="cf-icon cf-icon-fallback" aria-hidden="true">
          {app.name[0]}
        </span>
      )}
      <span>
        <span className="cf-shelf-name">{app.name}</span>
        <span className="cf-shelf-kind">{app.kind}</span>
      </span>
    </div>
  );
}
