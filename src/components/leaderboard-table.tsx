"use client";

import Link from "next/link";
import { Repository } from "@/lib/types";
import { LevelBadge } from "./level-badge";
import { RepoAvatar } from "./repo-avatar";
import { CATEGORIES, TOTAL_SKILLS, getRepoImage, getSkillsByCategory } from "@/lib/constants";
import { getSkillValue } from "@/lib/utils";

interface LeaderboardTableProps {
  repos: Repository[];
  startRank: number;
  filterKey?: string;
}

export function LeaderboardTable({ repos, startRank, filterKey }: LeaderboardTableProps) {
  return (
    <div className="">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-wood-mid/30 text-left text-xs text-rpg-muted">
            <th className="px-3 py-2 w-10">#</th>
            <th className="px-3 py-2 w-64">Repository</th>
            <th className="px-3 py-2 w-24">Level</th>
            <th className="px-3 py-2 w-20">Categories</th>
            <th className="px-3 py-2 text-right w-20">Score</th>
            <th className="px-3 py-2 text-right hidden sm:table-cell w-20">Stars</th>
            <th className="px-3 py-2 hidden md:table-cell w-24">Language</th>
          </tr>
        </thead>
        <tbody key={filterKey} className="animate-fade-in">
          {repos.map((repo, i) => {
            const imagePath = getRepoImage(repo.slug, repo.language);

            return (
              <tr
                key={repo.slug}
                className="border-b border-wood-dark/20 table-row-hover group"
              >
                <td className="px-3 py-2.5 text-rpg-muted">
                  {startRank + i}
                </td>
                <td className="px-3 py-2.5">
                  <div className="preview-trigger relative">
                    <Link
                      href={`/repo/${repo.slug}`}
                      className="flex items-center gap-3 text-rpg-accent hover:text-rpg-gold transition-colors"
                    >
                      <RepoAvatar slug={repo.slug} language={repo.language} size="sm" />
                      <span>{repo.name}</span>
                    </Link>

                    {/* Hover preview card */}
                    <div className="preview-card left-0 top-full mt-2 w-72">
                      <div className="wood-frame p-3">
                        <div className="flex gap-3">
                          {imagePath && (
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-wood-mid">
                              <img
                                src={imagePath}
                                alt={repo.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-rpg-text font-medium truncate">
                              {repo.name}
                            </div>
                            {repo.description && (
                              <p className="text-xs text-rpg-muted mt-1 line-clamp-2">
                                {repo.description}
                              </p>
                            )}
                            <div className="mt-2 flex items-center gap-2">
                              <LevelBadge level={repo.level} size="sm" />
                              <span className="text-xs text-rpg-muted text-xs">
                                {repo.skillCount}/{TOTAL_SKILLS}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Category mini bars */}
                        <div className="mt-3 grid grid-cols-4 gap-1.5">
                          {CATEGORIES.map((cat) => {
                            const score = repo.categoryScores[cat.id];
                            const pct = score.total > 0 ? (score.earned / score.total) * 100 : 0;
                            return (
                              <div key={cat.id}>
                                <div className="text-[8px] text-rpg-muted mb-0.5">{cat.shortLabel}</div>
                                <div className="h-1.5 bg-rpg-bg overflow-hidden">
                                  <div
                                    className="h-full"
                                    style={{
                                      width: `${pct}%`,
                                      backgroundColor: cat.color,
                                      opacity: 0.8,
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <LevelBadge level={repo.level} size="sm" />
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-1.5">
                    {CATEGORIES.map((cat) => {
                      const score = repo.categoryScores[cat.id];
                      const pct = score.total > 0 ? score.earned / score.total : 0;
                      const catSkills = getSkillsByCategory(cat.id);
                      return (
                        <div
                          key={cat.id}
                          className="preview-trigger relative"
                        >
                          <div
                            className="relative h-3 w-8 overflow-hidden cursor-pointer"
                            style={{ backgroundColor: `${cat.color}15` }}
                          >
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${pct * 100}%`,
                                backgroundColor: cat.color,
                                opacity: pct > 0 ? 0.8 : 0,
                              }}
                            />
                          </div>
                          {/* Category hover preview */}
                          <div className="preview-card left-1/2 -translate-x-1/2 top-full mt-2 w-48 z-50">
                            <div className="wood-frame p-2.5">
                              <div className="text-xs mb-1.5" style={{ color: cat.color }}>
                                {cat.label} — {score.earned}/{score.total}
                              </div>
                              <div className="space-y-1">
                                {catSkills.map((skill) => {
                                  const unlocked = getSkillValue(repo.skills, skill.key);
                                  return (
                                    <div key={skill.key} className="flex items-center gap-1.5 text-xs">
                                      <span style={{ color: unlocked ? cat.color : "#475569" }}>
                                        {unlocked ? "\u2713" : "\u2717"}
                                      </span>
                                      <span className={unlocked ? "text-rpg-text" : "text-rpg-muted opacity-50"}>
                                        {skill.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right text-rpg-muted text-xs">
                  {repo.skillCount}/{TOTAL_SKILLS}
                </td>
                <td className="px-3 py-2.5 text-right text-rpg-muted text-xs hidden sm:table-cell">
                  {repo.stars.toLocaleString()}
                </td>
                <td className="px-3 py-2.5 text-rpg-muted hidden md:table-cell">
                  {repo.language || "\u2014"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
