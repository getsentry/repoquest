import { OrgStats } from "@/lib/types";
import { LEVEL_COLORS, LEVEL_ORDER, CATEGORIES, getSkillsByCategory } from "@/lib/constants";
import { PixelCard } from "./ui/pixel-card";

interface OrgStatsSummaryProps {
  stats: OrgStats;
}

export function OrgStatsSummary({ stats }: OrgStatsSummaryProps) {
  const pctWithSkill =
    stats.totalRepos > 0
      ? Math.round((stats.reposWithAnySkill / stats.totalRepos) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <PixelCard hover>
          <div className="text-center">
            <div className="text-lg text-rpg-gold">
              {stats.totalRepos}
            </div>
            <div className="mt-1 text-xs text-rpg-muted">Total Repos</div>
          </div>
        </PixelCard>
        <PixelCard hover>
          <div className="preview-trigger relative text-center">
            <div className="text-lg text-rpg-accent">
              {stats.reposWithAnySkill}
            </div>
            <div className="mt-1 text-xs text-rpg-muted">AI Ready</div>
            <div className="preview-card left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 rounded bg-rpg-panel border border-wood-mid p-2 text-[10px] text-rpg-muted leading-relaxed text-left">
              Repos with at least one AI config skill (AGENTS.md, CLAUDE.md, .claude/, etc.)
            </div>
          </div>
        </PixelCard>
        <PixelCard hover sparkle>
          <div className="text-center">
            <div className="text-lg text-level-legendary">
              {stats.legendaryCount}
            </div>
            <div className="mt-1 text-xs text-rpg-muted">Legendary</div>
          </div>
        </PixelCard>
        <PixelCard hover>
          <div className="preview-trigger relative text-center">
            <div className="text-lg text-level-veteran">
              {pctWithSkill}%
            </div>
            <div className="mt-1 text-xs text-rpg-muted">AI Adoption</div>
            <div className="preview-card left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 rounded bg-rpg-panel border border-wood-mid p-2 text-[10px] text-rpg-muted leading-relaxed text-left">
              Percentage of repos with at least one AI config skill
            </div>
          </div>
        </PixelCard>
      </div>

      {/* Category averages */}
      <PixelCard>
        <div className="flex flex-wrap justify-center gap-6">
          {CATEGORIES.map((cat) => {
            const avg = stats.categoryAverages[cat.id];
            const catSkillCount = getSkillsByCategory(cat.id).length;
            const pct = Math.round((avg / catSkillCount) * 100);
            return (
              <div key={cat.id} className="text-center">
                <div className="text-xs text-rpg-muted mb-1">{cat.shortLabel}</div>
                <div className="relative h-2 w-20 bg-rpg-bg overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
                <div className="mt-1 text-[10px]" style={{ color: cat.color }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </PixelCard>

      {/* Level distribution mini-bar */}
      <PixelCard>
        <div className="flex h-4 overflow-hidden">
          {LEVEL_ORDER.map((level) => {
            const count = stats.levelDistribution[level];
            const pct =
              stats.totalRepos > 0 ? (count / stats.totalRepos) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={level}
                style={{
                  width: `${pct}%`,
                  backgroundColor: LEVEL_COLORS[level],
                }}
                title={`${level}: ${count}`}
              />
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {LEVEL_ORDER.map((level) => (
            <div key={level} className="flex items-center gap-1 text-[10px]">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: LEVEL_COLORS[level] }}
              />
              <span className="text-rpg-muted">
                {level}: {stats.levelDistribution[level]}
              </span>
            </div>
          ))}
        </div>
      </PixelCard>
    </div>
  );
}
