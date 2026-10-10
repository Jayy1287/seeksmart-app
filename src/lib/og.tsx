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
            "linear-gradient(135deg, #f3f8f6 0%, #ffffff 50%, #e6f4f1 100%)",
          color: "#17212b",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#087e8b",
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
            <div style={{ fontSize: 18, color: "#4d5b67" }}>
              Decide where AI belongs before you buy another tool
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#087e8b",
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
              letterSpacing: -1
            }}
          >
            {safeTitle}
          </div>
          {safeDescription ? (
            <div style={{ fontSize: 28, color: "#4d5b67", lineHeight: 1.35 }}>
              {safeDescription}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#4d5b67"
          }}
        >
          <div>{footer}</div>
          <div
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: 999,
              border: "2px solid #e76f51",
              color: "#b84d3b",
              fontWeight: 700
            }}
          >
            Workflow-first AI decisions
          </div>
        </div>
      </div>
    ),
    ogSize
  );
}
