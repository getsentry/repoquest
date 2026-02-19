import { OrgStats } from "@/lib/types";
import { LEVEL_ORDER, LEVEL_COLORS } from "@/lib/constants";
import { PixelCard } from "./ui/pixel-card";

interface LevelDistributionProps {
  stats: OrgStats;
}

export function LevelDistribution({ stats }: LevelDistributionProps) {
  const maxCount = Math.max(...Object.values(stats.levelDistribution));

  return (
    <PixelCard>
      <h2 className="text-xs text-rpg-gold mb-4">
        Level Distribution
      </h2>
      <div className="space-y-3">
        {LEVEL_ORDER.map((level) => {
          const count = stats.levelDistribution[level];
          const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={level} className="flex items-center gap-3">
              <span
                className="w-24 text-right text-xs"
                style={{ color: LEVEL_COLORS[level] }}
              >
                {level}
              </span>
              <div className="flex-1 h-5 bg-rpg-bg overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: LEVEL_COLORS[level],
                    minWidth: count > 0 ? "8px" : "0",
                  }}
                />
              </div>
              <span className="w-8 text-xs text-rpg-muted text-right font-mono">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </PixelCard>
  );
}
