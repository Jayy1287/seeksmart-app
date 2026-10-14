import { formatLevel, levelRank } from "@/features/opportunities/ease";

// Small effort/risk tag: three pips that fill with the level, then the word.
export function LevelTag({
  label,
  level,
  tone = "paper"
}: {
  label?: string;
  level: string;
  tone?: "paper" | "night";
}) {
  const rank = levelRank(level);
  const high = rank === 2;

  return (
    <span className={tone === "night" ? "tag tag-dark" : "tag"}>
      <span aria-hidden="true" className="flex items-end gap-[2px]">
        {[0, 1, 2].map((pip) => (
          <span
            className={`w-[3px] rounded-full ${
              pip <= rank
                ? high
                  ? "bg-signal"
                  : tone === "night"
                    ? "bg-white/80"
                    : "bg-ink/70"
                : tone === "night"
                  ? "bg-white/20"
                  : "bg-ink/15"
            }`}
            key={pip}
            style={{ height: 5 + pip * 2.5 }}
          />
        ))}
      </span>
      {formatLevel(level)}
      {label ? ` ${label}` : ""}
    </span>
  );
}
