import repoData from "../../data/repos.json";
import { RepoData, Repository, OrgStats, SkillKey, CategoryId } from "./types";
import { LEVEL_ORDER, SKILLS, CATEGORIES } from "./constants";
import { getSkillValue } from "./utils";
import type { Level } from "./types";

const data = repoData as unknown as RepoData;

export function getAllRepos(): Repository[] {
  return data.repositories;
}

export function getRepoBySlug(slug: string): Repository | undefined {
  return data.repositories.find((r) => r.slug === slug);
}

export function getAllSlugs(): string[] {
  return data.repositories.map((r) => r.slug);
}

export function getLastUpdated(): string {
  return data.lastUpdated;
}

export function getOrgStats(): OrgStats {
  const repos = data.repositories;

  const levelDistribution = Object.fromEntries(
    LEVEL_ORDER.map((level) => [
      level,
      repos.filter((r) => r.level === level).length,
    ])
  ) as Record<Level, number>;

  const skillPopularity = Object.fromEntries(
    SKILLS.map((skill) => [
      skill.key,
      repos.filter((r) => getSkillValue(r.skills, skill.key)).length,
    ])
  ) as Record<SkillKey, number>;

  const categoryAverages = Object.fromEntries(
    CATEGORIES.map((cat) => {
      const avgEarned =
        repos.length > 0
          ? repos.reduce((sum, r) => sum + r.categoryScores[cat.id].earned, 0) /
            repos.length
          : 0;
      return [cat.id, avgEarned];
    })
  ) as Record<CategoryId, number>;

  const totalSkills = repos.reduce((sum, r) => sum + r.skillCount, 0);

  return {
    totalRepos: repos.length,
    reposWithAnySkill: repos.filter((r) => r.skillCount > 0).length,
    averageSkillCount: repos.length > 0 ? totalSkills / repos.length : 0,
    legendaryCount: repos.filter((r) => r.level === "Legendary").length,
    levelDistribution,
    skillPopularity,
    categoryAverages,
  };
}
