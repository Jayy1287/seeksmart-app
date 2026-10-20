import type { CSSProperties, ReactNode } from "react";

// CSS-only infinite marquee. Content renders twice; the copy is hidden from
// assistive tech. Pauses on hover; stops under reduced motion.
export function Marquee({
  children,
  className,
  duration = 40,
  gap = "1rem",
  reverse = false
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  gap?: string;
  reverse?: boolean;
}) {
  const style = {
    "--marquee-duration": `${duration}s`,
    "--marquee-gap": gap
  } as CSSProperties;

  return (
    <div
      className={["marquee", className].filter(Boolean).join(" ")}
      data-reverse={reverse ? "true" : undefined}
      style={style}
    >
      <div className="marquee-track">{children}</div>
      <div aria-hidden="true" className="marquee-track">
        {children}
      </div>
    </div>
  );
}
