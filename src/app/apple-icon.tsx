import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a1f 0%, #0a0a0c 100%)",
          color: "#c8b69b",
          fontSize: 108,
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
        }}
      >
        R
      </div>
    ),
    { ...size }
  );
}
