import Link from "next/link";
import Reveal from "@/components/Reveal";
import { apps } from "@/lib/apps";
import {
  UPWORK_PROFILE_URL,
  formatReviewDates,
  type ClientReview,
} from "@/lib/reviews";

function Stars({ score }: { score: number }) {
  const filled = Math.round(score);
  return (
    <div className="flex items-center gap-2.5">
      <div
        role="img"
        aria-label={`Rated ${score.toFixed(1)} out of 5`}
        className="flex gap-0.5 text-accent"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            aria-hidden
            className={`size-3.5 ${i < filled ? "" : "opacity-25"}`}
          >
            <path
              fill="currentColor"
              d="M10 1.6l2.47 5.2 5.68.66-4.2 3.9 1.13 5.62L10 14.2l-5.08 2.78 1.13-5.62-4.2-3.9 5.68-.66L10 1.6z"
            />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold tracking-tight">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

export default function ReviewCard({
  review,
  index = 0,
  wide = false,
}: {
  review: ClientReview;
  index?: number;
  /** Full-width layout, used when a single review fills the row. */
  wide?: boolean;
}) {
  const caseStudy = review.caseStudy
    ? apps.find((a) => a.slug === review.caseStudy)
    : undefined;
  const verifyUrl = review.verifyUrl ?? UPWORK_PROFILE_URL;

  const meta = (
    <>
      <figcaption>
        <p className="font-semibold tracking-tight">{review.client}</p>
        <p className="mt-1 text-sm leading-snug text-muted">{review.project}</p>
        <p className="mt-2 text-xs text-faint">
          {formatReviewDates(review.start, review.end)}
        </p>
      </figcaption>

      {review.endorsements && review.endorsements.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {review.endorsements.map((e) => (
            <span
              key={e}
              className="rounded-full bg-foreground/[0.04] px-2.5 py-1 text-[11px] text-muted ring-hairline"
            >
              {e}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium">
        <a
          href={verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-3.5">
            <circle
              cx="10"
              cy="10"
              r="7.75"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="m6.9 10.2 2.1 2.1 4.1-4.4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Verified on Upwork ↗
        </a>
        {caseStudy && (
          <Link
            href={`/work/${caseStudy.slug}`}
            className="group/cs inline-flex items-center gap-1 text-foreground/85 transition-colors hover:text-accent"
          >
            {caseStudy.name} case study
            <span className="transition-transform duration-300 group-hover/cs:translate-x-1">
              →
            </span>
          </Link>
        )}
      </div>
    </>
  );

  return (
    <Reveal delay={(index % 3) * 0.08} className="h-full">
      <figure
        className={`group relative h-full overflow-hidden border border-hairline bg-surface transition-colors duration-300 hover:border-hairline-strong ${
          wide ? "rounded-[2rem] p-7 sm:p-10" : "flex flex-col rounded-3xl p-7"
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(70% 60% at 0% 0%, rgba(200,182,155,0.10) 0%, transparent 70%)",
          }}
        />

        {wide ? (
          <div className="relative grid gap-10 lg:grid-cols-[1.65fr_1fr] lg:items-end lg:gap-14">
            <div>
              <Stars score={review.score} />
              <blockquote className="mt-6 text-pretty text-lg leading-relaxed tracking-tight text-foreground/90 sm:text-xl sm:leading-relaxed lg:text-2xl lg:leading-relaxed">
                “{review.quote}”
              </blockquote>
            </div>
            <div className="border-t border-hairline pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              {meta}
            </div>
          </div>
        ) : (
          <div className="relative flex h-full flex-col">
            <Stars score={review.score} />
            <blockquote className="mt-5 text-pretty text-[15px] leading-relaxed text-foreground/85">
              “{review.quote}”
            </blockquote>
            <div className="mt-auto pt-6">
              <div className="border-t border-hairline pt-6">{meta}</div>
            </div>
          </div>
        )}
      </figure>
    </Reveal>
  );
}
