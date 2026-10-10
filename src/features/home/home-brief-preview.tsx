import { CheckCircle2, Lock } from "lucide-react";

// A static, zero-JS preview of a real audit brief. It replaces the stock
// Lottie illustration so the hero shows the product instead of clip art.
const preview = {
  readiness: 82,
  level: "Pilot-ready",
  industry: "Online store",
  area: "Customer support",
  opportunities: [
    { rank: 1, name: "Reduce support response time", score: 93, label: "Best fit" },
    { rank: 2, name: "Turn repeated questions into a knowledge base", score: 90, label: "Strong fit" },
    { rank: 3, name: "Draft product descriptions faster", score: 84, label: "Good fit" }
  ],
  reasons: [
    "Matches your industry and the team you chose",
    "Addresses slow response and repetitive manual work",
    "Daily volume means the pilot can be measured in two weeks"
  ]
};

export function HomeBriefPreview() {
  return (
    <div aria-hidden="true" className="brief-preview">
      <div className="brief-preview-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-extrabold uppercase tracking-wide text-accent">
              Your AI pilot brief
            </p>
            <p className="mt-1 text-sm font-semibold leading-5">
              {preview.industry} · {preview.area}
            </p>
          </div>
          <div className="brief-preview-score">
            <span className="text-2xl font-semibold leading-none">
              {preview.readiness}
            </span>
            <span className="mt-1 block text-[0.6rem] font-extrabold uppercase text-success">
              {preview.level}
            </span>
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          {preview.opportunities.map((opportunity) => (
            <div
              className="brief-preview-row"
              data-rank={opportunity.rank}
              key={opportunity.rank}
            >
              <span className="brief-preview-rank">#{opportunity.rank}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                {opportunity.name}
              </span>
              <span className="text-[0.62rem] font-bold uppercase text-ink/45">
                {opportunity.label}
              </span>
              <span className="text-sm font-semibold">{opportunity.score}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-line/60 pt-3">
          <p className="text-[0.65rem] font-extrabold uppercase tracking-wide text-ink/45">
            Why #1 ranked first
          </p>
          <ul className="mt-2 grid gap-1.5">
            {preview.reasons.map((reason) => (
              <li className="flex items-start gap-2 text-xs leading-5 text-ink/70" key={reason}>
                <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-accent" size={13} />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="brief-preview-chip">
        <Lock aria-hidden="true" size={12} />
        Pilot plan and tool shortlist unlock with an email
      </div>
    </div>
  );
}
