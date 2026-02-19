import { getOrgStats } from "@/lib/data";
import { CATEGORIES, getSkillsByCategory } from "@/lib/constants";
import { LevelDistribution } from "@/components/level-distribution";
import { SkillPopularity } from "@/components/skill-popularity";
import { PixelCard } from "@/components/ui/pixel-card";
import { Sparkles } from "@/components/sparkles";

export default function StatsPage() {
  const stats = getOrgStats();

  const pctWithSkill =
    stats.totalRepos > 0
      ? Math.round((stats.reposWithAnySkill / stats.totalRepos) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-lg text-rpg-gold mb-2">
          <Sparkles count={4}>Stats Dashboard</Sparkles>
        </h1>
        <p className="text-sm text-rpg-muted">
          RepoQuest metrics across 4 categories, 15 skills
        </p>
      </div>

      {/* Summary cards */}
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
          <div className="text-center">
            <div className="text-lg text-rpg-accent">
              {stats.averageSkillCount.toFixed(1)}
            </div>
            <div className="mt-1 text-xs text-rpg-muted">Avg Skills</div>
          </div>
        </PixelCard>
        <PixelCard hover>
          <div className="text-center">
            <div className="text-lg text-level-veteran">
              {pctWithSkill}%
            </div>
            <div className="mt-1 text-xs text-rpg-muted">Has AI Files</div>
          </div>
        </PixelCard>
        <PixelCard hover sparkle>
          <div className="text-center">
            <div className="text-lg text-level-legendary legendary-pulse">
              {stats.legendaryCount}
            </div>
            <div className="mt-1 text-xs text-rpg-muted">Legendary</div>
          </div>
        </PixelCard>
      </div>

      {/* Category breakdown */}
      <PixelCard>
        <h2 className="text-xs text-rpg-gold mb-4">
          Category Averages
        </h2>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => {
            const avg = stats.categoryAverages[cat.id];
            const catSkillCount = getSkillsByCategory(cat.id).length;
            const pct = (avg / catSkillCount) * 100;

            return (
              <div key={cat.id} className="flex items-center gap-3">
                <span
                  className="w-24 text-right text-xs"
                  style={{ color: cat.color }}
                >
                  {cat.label}
                </span>
                <div className="flex-1 h-5 bg-rpg-bg overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: cat.color,
                      opacity: 0.8,
                      minWidth: avg > 0 ? "8px" : "0",
                    }}
                  />
                </div>
                <span className="w-12 text-xs text-rpg-muted text-right font-mono">
                  {avg.toFixed(1)}/{catSkillCount}
                </span>
              </div>
            );
          })}
        </div>
      </PixelCard>

      {/* Charts */}
      <LevelDistribution stats={stats} />

      <h2 className="text-xs text-rpg-gold text-center">
        Skill Adoption by Category
      </h2>
      <SkillPopularity stats={stats} />
    </div>
  );
}
