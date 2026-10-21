"use client";

import Image from "next/image";
import { useState } from "react";

export type ShippedApp = {
  slug: string;
  name: string;
  what: string;
  category: string;
  firstRelease: string;
  version: string;
  versionDate: string;
  problem: string;
  icon: string | null;
  screenshot: string;
  url: string;
};

function Phone({ app, size }: { app: ShippedApp; size: "lg" | "sm" }) {
  return (
    <div className={`rl-phone rl-phone--${size}`}>
      <div className="rl-phone-screen">
        <Image
          key={app.slug}
          src={app.screenshot}
          alt={`${app.name} on iPhone, a real screen from the app`}
          width={920}
          height={2000}
          sizes={size === "lg" ? "300px" : "200px"}
          className="rl-phone-img"
        />
      </div>
      <span className="rl-phone-island" aria-hidden />
    </div>
  );
}

function Icon({ app }: { app: ShippedApp }) {
  if (!app.icon) {
    return (
      <span className="rl-appicon rl-appicon--fallback" aria-hidden>
        {app.name[0]}
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={app.icon} alt="" width={52} height={52} className="rl-appicon" loading="lazy" />;
}

// "Shipped": one notebook page. The list is the index; the phone shows the
// selected app. On a phone the selected row opens and carries its own screen.
export default function Shipped({ apps }: { apps: ShippedApp[] }) {
  const [sel, setSel] = useState(0);
  const app = apps[sel];

  return (
    <div className="rl-shipped">
      <ol className="rl-applist">
        {apps.map((a, i) => (
          <li key={a.slug} className={i === sel ? "is-sel" : ""}>
            <button
              className="rl-app-row"
              aria-pressed={i === sel}
              aria-label={`Show ${a.name}`}
              onClick={() => setSel(i)}
            >
              <span className="rl-app-num rl-mono">{String(i + 1).padStart(2, "0")}</span>
              <Icon app={a} />
              <span className="rl-app-main">
                <span className="rl-app-name">
                  {a.name}
                  <span className="rl-app-what">{a.what}</span>
                </span>
                <span className="rl-app-problem">{a.problem}</span>
              </span>
              <span className="rl-app-dates rl-mono">
                <span>First release {a.firstRelease}</span>
                <span>
                  v{a.version} · {a.versionDate}
                </span>
              </span>
            </button>
            {i === sel && (
              <div className="rl-app-inline">
                <Phone app={a} size="sm" />
                <a className="rl-link" href={a.url} target="_blank" rel="noopener noreferrer">
                  {a.name} on the App Store ↗
                </a>
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="rl-phone-stage" aria-live="polite">
        <Phone app={app} size="lg" />
        <div className="rl-phone-caption">
          <span className="rl-mono">
            {String(sel + 1).padStart(2, "0")} / {String(apps.length).padStart(2, "0")} · {app.category}
          </span>
          <a className="rl-link" href={app.url} target="_blank" rel="noopener noreferrer">
            {app.name} on the App Store ↗
          </a>
        </div>
      </div>
    </div>
  );
}
