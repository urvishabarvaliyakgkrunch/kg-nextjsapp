// src/app/opengraph-image.tsx
// The card Google, Slack, WhatsApp and X show when somebody shares a link. Drawn here
// rather than shipped as a PNG so the wording stays in one place with the metadata.
// ImageResponse supports flexbox only — no CSS grid, no external stylesheets.

import { ImageResponse } from "next/og";

export const alt = "Elixser Peptides — High-Purity Research Peptides";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "#0A0A0A",
          color: "#FFFFFF",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#3473FB",
          }}
        >
          Elixser Peptides
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 76,
            lineHeight: 1.1,
            fontWeight: 700,
          }}
        >
          High-Purity Research Peptides
        </div>

        <div style={{ display: "flex", marginTop: 32, fontSize: 32, color: "#8A8A85" }}>
          Triple-tested in the USA · A signed COA on every batch
        </div>

        {/* Brand rule, standing in for a logo so no image fetch is needed */}
        <div
          style={{
            marginTop: 56,
            width: 180,
            height: 8,
            background: "#0165FF",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
