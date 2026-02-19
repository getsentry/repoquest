import { OrgStats } from "@/lib/types";
import { SKILLS, CATEGORIES, getSkillsByCategory } from "@/lib/constants";
import { PixelCard } from "./ui/pixel-card";

interface SkillPopularityProps {
  stats: OrgStats;
}

export function SkillPopularity({ stats }: SkillPopularityProps) {
  const maxCount = Math.max(...Object.values(stats.skillPopularity));

  return (
    <div className="space-y-4">
      {CATEGORIES.map((cat) => {
        const catSkills = getSkillsByCategory(cat.id);
        const sorted = [...catSkills].sort(
          (a, b) =>
            (stats.skillPopularity[b.key] || 0) -
            (stats.skillPopularity[a.key] || 0)
        );

        return (
          <PixelCard key={cat.id}>
            <h3
              className="text-[10px] mb-3"
              style={{ color: cat.color }}
            >
              {cat.label}
            </h3>
            <div className="space-y-2">
              {sorted.map((skill) => {
                const count = stats.skillPopularity[skill.key] || 0;
                const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;

                return (
                  <div key={skill.key} className="flex items-center gap-3">
                    <span className="w-48 text-right text-xs text-rpg-text truncate">
                    {skill.label}
                    </span>
                    <div className="flex-1 h-4 bg-rpg-bg overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: cat.color,
                          minWidth: count > 0 ? "8px" : "0",
                          opacity: 0.8,
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
      })}
    </div>
  );
}
