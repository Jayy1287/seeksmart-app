import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type OgImageInput = {
  eyebrow: string;
  title: string;
  description?: string | null;
  footer?: string;
};

export function renderOgImage({
  eyebrow,
  title,
  description,
  footer = "seeksmart.in"
}: OgImageInput) {
  const safeTitle = title.length > 90 ? `${title.slice(0, 87)}...` : title;
  const safeDescription =
    description && description.length > 150
      ? `${description.slice(0, 147)}...`
      : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "radial-gradient(circle at 92% 8%, #5a2412 0%, #0c0c0e 46%)",
          color: "#f4f2ed",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#ff5c26",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 30,
              fontWeight: 700
            }}
          >
            S
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 700 }}>SeekSmart</div>
            <div style={{ fontSize: 18, color: "#8d8a84" }}>
              Know where AI pays back
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#ff5c26",
              textTransform: "uppercase",
              letterSpacing: 2
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: safeTitle.length > 50 ? 56 : 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2.5
            }}
          >
            {safeTitle}
          </div>
          {safeDescription ? (
            <div style={{ fontSize: 28, color: "#a19e97", lineHeight: 1.35 }}>
              {safeDescription}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#8d8a84"
          }}
        >
          <div>{footer}</div>
          <div
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: 999,
              border: "2px solid #ff5c26",
              color: "#ff5c26",
              fontWeight: 700
            }}
          >
            Free three-minute AI audit
          </div>
        </div>
      </div>
    ),
    ogSize
  );
}
