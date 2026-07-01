import Image from "next/image";

/**
 * CSS-only iPhone Pro frame, titanium edge, side buttons, Dynamic Island,
 * glass reflection. Renders a screenshot when `src` is provided, otherwise
 * an accent-tinted placeholder with the app name.
 */
export default function DeviceFrame({
  src,
  alt,
  accent = "#c8b69b",
  label,
  priority = false,
}: {
  src?: string;
  alt: string;
  accent?: string;
  label?: string;
  priority?: boolean;
}) {
  return (
    <div className="relative">
      {/* side buttons, left: action + volumes, right: power */}
      <div
        aria-hidden
        className="absolute -left-[1.5%] top-[17%] h-[3.5%] w-[1.5%] rounded-l-md bg-gradient-to-b from-[#4a4a4f] via-[#2a2a2e] to-[#4a4a4f]"
      />
      <div
        aria-hidden
        className="absolute -left-[1.5%] top-[24%] h-[6.5%] w-[1.5%] rounded-l-md bg-gradient-to-b from-[#4a4a4f] via-[#2a2a2e] to-[#4a4a4f]"
      />
      <div
        aria-hidden
        className="absolute -left-[1.5%] top-[32.5%] h-[6.5%] w-[1.5%] rounded-l-md bg-gradient-to-b from-[#4a4a4f] via-[#2a2a2e] to-[#4a4a4f]"
      />
      <div
        aria-hidden
        className="absolute -right-[1.5%] top-[26%] h-[10%] w-[1.5%] rounded-r-md bg-gradient-to-b from-[#4a4a4f] via-[#2a2a2e] to-[#4a4a4f]"
      />

      {/* titanium body */}
      <div
        className="relative aspect-[9/19.4] w-full overflow-hidden rounded-[12.5%/5.8%] p-[2.6%]"
        style={{
          background:
            "linear-gradient(145deg, #3d3d42 0%, #1b1b1f 30%, #0d0d10 55%, #26262b 85%, #45454b 100%)",
          boxShadow: `
            inset 0 0 0 1px rgba(255,255,255,0.16),
            inset 0 0 5px 1px rgba(255,255,255,0.05),
            0 30px 90px rgba(0,0,0,0.6),
            0 6px 24px rgba(0,0,0,0.45),
            0 0 140px -30px ${accent}40
          `,
        }}
      >
        {/* inner black bezel */}
        <div className="relative h-full w-full overflow-hidden rounded-[10.2%/4.8%] bg-black p-[1.6%] shadow-[inset_0_0_2px_1px_rgba(0,0,0,0.9)]">
          {/* screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[8.8%/4.2%] bg-surface-2">
            {src ? (
              <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                className="object-cover"
                sizes="(max-width: 768px) 60vw, 320px"
              />
            ) : (
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-3"
                style={{
                  background: `
                    radial-gradient(120% 80% at 50% 0%, ${accent}30 0%, transparent 55%),
                    radial-gradient(100% 60% at 50% 110%, ${accent}14 0%, transparent 60%),
                    linear-gradient(180deg, #16161a 0%, #0a0a0d 100%)
                  `,
                }}
              >
                <span
                  className="flex size-12 items-center justify-center rounded-2xl border text-lg font-semibold"
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

            {/* glass reflection sweep */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(118deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 28%, transparent 42%, transparent 100%)",
              }}
            />
          </div>

          {/* dynamic island */}
          <div className="absolute left-1/2 top-[3.4%] flex h-[3.1%] w-[27%] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-[4.5%] shadow-[inset_0_0_1px_rgba(255,255,255,0.18)]">
            <span className="block aspect-square h-[52%] rounded-full bg-[#101018] shadow-[inset_0_0_2px_rgba(70,90,140,0.8)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
