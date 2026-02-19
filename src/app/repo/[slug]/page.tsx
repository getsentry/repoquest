import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getRepoBySlug } from "@/lib/data";
import { CATEGORIES, LEVEL_COLORS, TOTAL_SKILLS, getSkillsByCategory, getRepoImage } from "@/lib/constants";
import { getSkillValue } from "@/lib/utils";
import { LevelBadge } from "@/components/level-badge";
import { CategoryTree } from "@/components/skill-tree";
import { SkillIcon } from "@/components/skill-icons";
import { PixelCard } from "@/components/ui/pixel-card";
import { CopyPrompt } from "@/components/copy-prompt";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RepoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const repo = getRepoBySlug(slug);

  if (!repo) {
    notFound();
  }

  const levelColor = LEVEL_COLORS[repo.level];
  const imagePath = getRepoImage(repo.slug, repo.language);
  const isLegendary = repo.level === "Legendary";

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-rpg-muted hover:text-rpg-accent transition-colors"
      >
        <span>&#8592;</span> Back to Leaderboard
      </Link>

      {/* Header */}
      <PixelCard gold={isLegendary} sparkle={isLegendary}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            {/* Repo avatar */}
            {imagePath && (
              <div className="flex-shrink-0">
                <div className={`h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded border-2 ${isLegendary ? "border-rpg-gold" : "border-wood-mid"}`}>
                  <img
                    src={imagePath}
                    alt={repo.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
            <div>
              <h1 className="text-base text-rpg-text mb-2">
                {repo.name}
              </h1>
              {repo.description && (
                <p className="text-sm text-rpg-muted mb-3">{repo.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-xs text-rpg-muted">
                {repo.language && <span>{repo.language}</span>}
                <span>&#11088; {repo.stars.toLocaleString()}</span>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rpg-accent hover:text-rpg-gold transition-colors"
                >
                  View on GitHub &#8594;
                </a>
              </div>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <LevelBadge level={repo.level} size="lg" />
            <div
              className="mt-2 text-2xl"
              style={{ color: levelColor }}
            >
              {repo.skillCount}/{TOTAL_SKILLS}
            </div>
            <div className="text-xs text-rpg-muted">Skills Unlocked</div>
          </div>
        </div>

        {/* Category progress bars */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const score = repo.categoryScores[cat.id];
            const pct = score.total > 0 ? (score.earned / score.total) * 100 : 0;
            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px]" style={{ color: cat.color }}>
                    {cat.shortLabel}
                  </span>
                  <span className="text-[10px] text-rpg-muted font-mono">
                    {score.earned}/{score.total}
                  </span>
                </div>
                <div className="h-2 bg-rpg-bg overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </PixelCard>

      {/* Per-category skill trees */}
      {CATEGORIES.map((cat) => {
        const catSkills = getSkillsByCategory(cat.id);
        const score = repo.categoryScores[cat.id];

        return (
          <PixelCard key={cat.id}>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xs"
                style={{ color: cat.color }}
              >
                {cat.label}
              </h2>
              <span className="text-xs text-rpg-muted font-mono">
                {score.earned}/{score.total}
              </span>
            </div>

            <CategoryTree categoryId={cat.id} skills={repo.skills} />

            {/* Skills list */}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {catSkills.map((skill) => {
                const unlocked = getSkillValue(repo.skills, skill.key);
                return (
                  <div
                    key={skill.key}
                    className={`flex items-center gap-3 rounded p-2.5 transition-all ${
                      unlocked
                        ? "bg-wood-dark/20 border border-wood-mid/20"
                        : "bg-rpg-bg/50 opacity-50 border border-transparent"
                    }`}
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded"
                      style={{
                        backgroundColor: unlocked ? `${cat.color}20` : "#1e293b",
                      }}
                    >
                      <svg viewBox="0 0 18 18" width={20} height={20}>
                        <SkillIcon
                          skillKey={skill.key}
                          x={9}
                          y={9}
                          color={unlocked ? cat.color : "#475569"}
                          size={16}
                        />
                      </svg>
                    </span>
                    <div>
                      <div className="text-sm text-rpg-text">{skill.label}</div>
                      <div className="text-xs text-rpg-muted">
                        {skill.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </PixelCard>
        );
      })}

      {/* Copy prompt for missing skills */}
      {repo.skillCount < TOTAL_SKILLS && (
        <PixelCard>
          <CopyPrompt repo={repo} />
        </PixelCard>
      )}

      {/* Markdown files found */}
      {repo.markdownFiles.length > 0 && (
        <PixelCard>
          <h2 className="text-xs text-rpg-gold mb-4">
            Markdown Files Found
          </h2>
          <div className="space-y-1.5">
            {repo.markdownFiles.map((file) => {
              const tagColors: Record<string, string> = {
                readme: "#34d399",
                contributing: "#34d399",
                "ai-config": "#818cf8",
                docs: "#22d3ee",
                other: "#64748b",
              };
              const tagLabels: Record<string, string> = {
                readme: "README",
                contributing: "CONTRIBUTING",
                "ai-config": "AI Config",
                docs: "Documentation",
                other: "Other",
              };
              return (
                <div
                  key={file.path}
                  className="flex items-center gap-3 rounded px-2.5 py-1.5 bg-rpg-bg/30"
                >
                  <span className="text-xs text-rpg-muted font-mono flex-1 truncate">
                    {file.path}
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded"
                    style={{
                      color: tagColors[file.classification],
                      backgroundColor: `${tagColors[file.classification]}15`,
                    }}
                  >
                    {tagLabels[file.classification]}
                  </span>
                </div>
              );
            })}
          </div>
        </PixelCard>
      )}
    </div>
  );
}
