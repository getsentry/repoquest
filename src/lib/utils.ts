import { Level, SkillSet, SkillKey, CategoryId, CategoryScore } from "./types";
import { LEVEL_THRESHOLDS, CATEGORIES, getSkillsByCategory } from "./constants";

export function countSkills(skills: SkillSet): number {
  let count = 0;
  for (const category of Object.values(skills)) {
    for (const value of Object.values(category)) {
      if (value) count++;
    }
  }
  return count;
}

export function calculateLevel(skillCount: number): Level {
  for (const { min, max, level } of LEVEL_THRESHOLDS) {
    if (skillCount >= min && skillCount <= max) {
      return level;
    }
  }
  return "Novice";
}

export function getCategoryScores(skills: SkillSet): Record<CategoryId, CategoryScore> {
  const scores = {} as Record<CategoryId, CategoryScore>;

  for (const cat of CATEGORIES) {
    const catSkills = getSkillsByCategory(cat.id);
    const categoryData = skills[cat.id] as unknown as Record<string, boolean>;
    const earned = Object.values(categoryData).filter(Boolean).length;
    scores[cat.id] = { earned, total: catSkills.length };
  }

  return scores;
}

export function getSkillValue(skills: SkillSet, key: SkillKey): boolean {
  for (const category of Object.values(skills)) {
    if (key in category) {
      return (category as unknown as Record<string, boolean>)[key];
    }
  }
  return false;
}

export function getAllSkillEntries(skills: SkillSet): [SkillKey, boolean][] {
  const entries: [SkillKey, boolean][] = [];
  for (const category of Object.values(skills)) {
    for (const [key, value] of Object.entries(category)) {
      entries.push([key as SkillKey, value as boolean]);
    }
  }
  return entries;
}
