import type { Point } from "@/lib/indie";

// Server-rendered area chart of monthly MRR. Pure SVG, no client JS.
// `compact` drops the axes and stretches to fill a widget.

const money = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `$${Math.round(n)}`;

const month = (t: number) => new Date(t).toLocaleString("en-US", { month: "short", timeZone: "UTC" });

// Catmull-Rom through the points, drawn as cubic Béziers.
function smoothPath(xy: [number, number][]) {
  let d = `M${xy[0][0]},${xy[0][1]}`;
  for (let i = 0; i < xy.length - 1; i++) {
    const [x0, y0] = xy[Math.max(0, i - 1)];
    const [x1, y1] = xy[i];
    const [x2, y2] = xy[i + 1];
    const [x3, y3] = xy[Math.min(xy.length - 1, i + 2)];
    const c1 = [x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6];
    const c2 = [x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${x2},${y2}`;
  }
  return d;
}

export default function RevenueChart({
  points,
  id,
  compact = false,
  className = "",
}: {
  points: Point[];
  id: string;
  compact?: boolean;
  className?: string;
}) {
  const W = compact ? 200 : 400;
  const H = compact ? 64 : 120;
  const LEFT = compact ? 0 : 42; // room for the y labels
  const TOP = compact ? 4 : 6;
  const BOTTOM = compact ? 1 : 20; // room for the month labels

  const max = Math.max(...points.map((p) => p.v), 1);
  const plotH = H - TOP - BOTTOM;
  const step = (W - LEFT) / Math.max(points.length - 1, 1);
  const xy = points.map((p, i): [number, number] => [LEFT + i * step, TOP + (1 - p.v / max) * plotH]);
  const line = smoothPath(xy);
  const base = TOP + plotH;
  const area = `${line} L${xy[xy.length - 1][0]},${base} L${xy[0][0]},${base} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={compact ? "none" : "xMidYMid meet"}
      className={`w-full ${className}`}
      role="img"
      aria-label="Monthly revenue, last 12 months"
    >
      <defs>
        <linearGradient id={`mrr-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--i-mark)", stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: "var(--i-mark)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {!compact &&
        [0, 0.5].map((f) => (
          <g key={f}>
            <line
              x1={LEFT}
              x2={W}
              y1={TOP + f * plotH}
              y2={TOP + f * plotH}
              style={{ stroke: "var(--i-line)" }}
              strokeDasharray="2 3"
            />
            <text
              x={LEFT - 6}
              y={TOP + f * plotH + 3}
              textAnchor="end"
              fontSize="11"
              style={{ fill: "var(--i-faint)" }}
            >
              {money(max * (1 - f))}
            </text>
          </g>
        ))}

      <path d={area} fill={`url(#mrr-${id})`} />
      <path
        d={line}
        fill="none"
        style={{ stroke: "var(--i-ink)" }}
        strokeWidth="1.6"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Every other month, counted back from the latest, so labels never touch */}
      {!compact &&
        points.map((p, i) => (points.length - 1 - i) % 2 === 0 && (
          <text
            key={p.t}
            x={LEFT + i * step}
            y={H - 4}
            textAnchor={i === points.length - 1 ? "end" : "middle"}
            fontSize="11"
            style={{ fill: "var(--i-faint)" }}
          >
            {month(p.t)}
          </text>
        ))}
    </svg>
  );
}
