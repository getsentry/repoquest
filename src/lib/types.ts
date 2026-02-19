export type Level =
  | "Novice"
  | "Apprentice"
  | "Veteran"
  | "Elite"
  | "Heroic"
  | "Legendary";

export type CategoryId = "aiConfig" | "buildVerify" | "documentation" | "codeQuality";

// AI Config skills (5)
export interface AIConfigSkills {
  agentsMd: boolean;
  claudeMd: boolean;
  claudeDir: boolean;
  cursorRulesDir: boolean;
  cursorignore: boolean;
}

// Build & Verify skills (2)
export interface BuildVerifySkills {
  makefile: boolean;
  ciWorkflows: boolean;
}

// Documentation skills (3)
export interface DocumentationSkills {
  readme: boolean;
  contributing: boolean;
  additionalDocs: boolean;
}

// Code Quality skills (5)
export interface CodeQualitySkills {
  typeChecking: boolean;
  linter: boolean;
  formatter: boolean;
  preCommitHooks: boolean;
  testInfra: boolean;
}

export interface SkillSet {
  aiConfig: AIConfigSkills;
  buildVerify: BuildVerifySkills;
  documentation: DocumentationSkills;
  codeQuality: CodeQualitySkills;
}

export type SkillKey =
  | keyof AIConfigSkills
  | keyof BuildVerifySkills
  | keyof DocumentationSkills
  | keyof CodeQualitySkills;

export interface CategoryScore {
  earned: number;
  total: number;
}

// Markdown files found in the repo (used for documentation analysis)
export interface MarkdownFile {
  path: string;
  classification: "readme" | "contributing" | "ai-config" | "docs" | "other";
}

export interface Repository {
  name: string;
  slug: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  skills: SkillSet;
  skillCount: number;
  categoryScores: Record<CategoryId, CategoryScore>;
  level: Level;
  markdownFiles: MarkdownFile[];
}

export interface RepoData {
  lastUpdated: string;
  orgName: string;
  repositories: Repository[];
}

export interface OrgStats {
  totalRepos: number;
  reposWithAnySkill: number;
  averageSkillCount: number;
  legendaryCount: number;
  levelDistribution: Record<Level, number>;
  skillPopularity: Record<SkillKey, number>;
  categoryAverages: Record<CategoryId, number>;
}
