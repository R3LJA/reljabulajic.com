import { ImageResponse } from "next/og";

export const alt =
  "Relja Bulajić — Full-Stack & AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#070708",
          backgroundImage:
            "radial-gradient(900px 500px at 12% -10%, rgba(200,182,155,0.16), transparent 60%), radial-gradient(800px 500px at 110% 120%, rgba(125,184,232,0.12), transparent 60%)",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* top: eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#9d9da6",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid rgba(200,182,155,0.4)",
              color: "#c8b69b",
              fontSize: 34,
              fontStyle: "italic",
            }}
          >
            R
          </div>
          Relja Bulajić
        </div>

        {/* middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 78,
              color: "#f4f4f5",
              lineHeight: 1.05,
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 700,
              letterSpacing: -2,
            }}
          >
            I build AI-native apps that feel
          </div>
          <div
            style={{
              fontSize: 78,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: -2,
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#f4f4f5",
              display: "flex",
              gap: 20,
            }}
          >
            like <span style={{ color: "#c8b69b", fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>Apple</span> made them.
          </div>
        </div>

        {/* bottom: proof row */}
        <div
          style={{
            display: "flex",
            gap: 40,
            color: "#c8b69b",
            fontSize: 28,
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          {[
            "Full-Stack & AI Engineer",
            "Top Rated · 100% JSS",
            "12 apps · 4,000+ users",
          ].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
