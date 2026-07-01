import Image from "next/image";

/**
 * CSS-only browser window frame for web projects. Renders a screenshot when
 * `src` is provided, otherwise an accent-tinted placeholder with the app name.
 */
export default function BrowserFrame({
  src,
  alt,
  accent = "#c8b69b",
  label,
  url,
  priority = false,
}: {
  src?: string;
  alt: string;
  accent?: string;
  label?: string;
  url?: string;
  priority?: boolean;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-hairline-strong bg-[#1a1a1e]"
      style={{
        boxShadow: `0 24px 70px rgba(0,0,0,0.45), 0 0 110px -30px ${accent}33`,
      }}
    >
      {/* chrome bar */}
      <div className="flex items-center gap-3 border-b border-hairline bg-[#222227] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#FF5F57]" />
          <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="size-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex h-6 flex-1 items-center justify-center rounded-md bg-black/30 px-3">
          <span className="truncate text-[10px] tracking-wide text-white/40">
            {url ?? `${(label ?? "app").toLowerCase().replace(/[^a-z0-9.]/g, "")}.com`}
          </span>
        </div>
      </div>
      {/* viewport */}
      <div className="relative aspect-[16/10] w-full bg-surface-2">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover object-top"
            sizes="(max-width: 768px) 90vw, 480px"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-3"
            style={{
              background: `
                radial-gradient(120% 90% at 50% 0%, ${accent}26 0%, transparent 60%),
                linear-gradient(180deg, #16161a 0%, #0a0a0d 100%)
              `,
            }}
          >
            <span
              className="flex size-11 items-center justify-center rounded-xl border text-base font-semibold"
              style={{
                borderColor: `${accent}40`,
                color: accent,
                background: `${accent}14`,
              }}
            >
              {label?.charAt(0)}
            </span>
            {label && (
              <span
                className="text-[11px] font-medium uppercase tracking-[0.3em]"
                style={{ color: `${accent}cc` }}
              >
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
