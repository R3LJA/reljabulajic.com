/**
 * Official-style "Download on the App Store" badge.
 * If `href` is missing or "#", renders a non-interactive "Coming soon" state.
 */
export default function AppStoreBadge({
  href,
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  const live = !!href && href !== "#";

  const inner = (
    <span className="flex items-center gap-3 rounded-xl border border-white/15 bg-black px-5 py-2.5">
      <svg viewBox="0 0 384 512" className="size-7 fill-white" aria-hidden>
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
      </svg>
      <span className="text-left leading-none">
        <span className="block text-[10px] text-white/70">
          {live ? "Download on the" : "Coming soon to the"}
        </span>
        <span className="block text-[19px] font-semibold tracking-tight text-white">
          App Store
        </span>
      </span>
    </span>
  );

  if (!live) {
    return (
      <div
        className={`inline-flex cursor-default opacity-55 ${className}`}
        aria-disabled
        title="Link coming soon"
      >
        {inner}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex transition-transform duration-300 hover:scale-[1.03] ${className}`}
    >
      {inner}
    </a>
  );
}
