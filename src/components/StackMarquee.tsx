/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { marqueeLogos } from "@/lib/stack";

function Row({
  items,
  reverse = false,
  duration = 48,
}: {
  items: { name: string; logo: string }[];
  reverse?: boolean;
  duration?: number;
}) {
  // duplicated list = seamless loop
  const doubled = [...items, ...items];
  return (
    <div className="marquee-row group/row relative flex overflow-hidden">
      <div
        className={`flex w-max shrink-0 items-center gap-3 pr-3 ${
          reverse ? "marquee-track-reverse" : "marquee-track"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="flex shrink-0 items-center gap-2.5 rounded-2xl border border-hairline bg-surface px-5 py-3 transition-colors duration-300 hover:border-hairline-strong"
          >
            <img
              src={item.logo}
              alt=""
              aria-hidden
              className="size-5 opacity-80"
              loading="lazy"
            />
            <span className="text-sm text-muted">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StackMarquee() {
  const half = Math.ceil(marqueeLogos.length / 2);
  const rowA = marqueeLogos.slice(0, half);
  const rowB = marqueeLogos.slice(half);

  return (
    <section className="mt-32">
      <Reveal>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              The <span className="serif-accent text-accent">stack</span>
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted">
              Full-stack by necessity, iOS-obsessed by choice, every tool here
              is proven in shipped products.
            </p>
          </div>
          <Link
            href="/about#stack"
            className="hidden text-sm text-muted transition-colors hover:text-accent sm:block"
          >
            Full breakdown →
          </Link>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <div
          className="relative space-y-3"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <Row items={rowA} duration={46} />
          <Row items={rowB} reverse duration={56} />
        </div>
      </Reveal>
    </section>
  );
}
