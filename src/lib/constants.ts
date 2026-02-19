import { Level, SkillKey, CategoryId } from "./types";

export interface SkillDefinition {
  key: SkillKey;
  category: CategoryId;
  label: string;
  filePaths: string[];
  description: string;
}

export interface CategoryDefinition {
  id: CategoryId;
  label: string;
  shortLabel: string;
  color: string;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: "aiConfig",
    label: "AI Config",
    shortLabel: "AI",
    color: "#818cf8",
    icon: "brain",
    description: "AI agent instruction files",
  },
  {
    id: "buildVerify",
    label: "Build & Verify",
    shortLabel: "Build",
    color: "#f472b6",
    icon: "hammer",
    description: "Build tools and verification infrastructure",
  },
  {
    id: "documentation",
    label: "Documentation",
    shortLabel: "Docs",
    color: "#34d399",
    icon: "book",
    description: "Project documentation",
  },
  {
    id: "codeQuality",
    label: "Code Quality",
    shortLabel: "Quality",
    color: "#fbbf24",
    icon: "shield",
    description: "Type safety, linting, testing",
  },
];

export const SKILLS: SkillDefinition[] = [
  // AI Config (5)
  {
    key: "agentsMd",
    category: "aiConfig",
    label: "AGENTS.md",
    filePaths: ["AGENTS.md"],
    description: "Vendor-neutral agent instructions",
  },
  {
    key: "claudeMd",
    category: "aiConfig",
    label: "CLAUDE.md",
    filePaths: ["CLAUDE.md"],
    description: "Claude Code instructions",
  },
  {
    key: "claudeDir",
    category: "aiConfig",
    label: ".claude/",
    filePaths: [".claude"],
    description: "Claude config directory",
  },
  {
    key: "cursorRulesDir",
    category: "aiConfig",
    label: ".cursor/rules/",
    filePaths: [".cursor/rules"],
    description: "Cursor rules directory",
  },
  {
    key: "cursorignore",
    category: "aiConfig",
    label: ".cursorignore",
    filePaths: [".cursorignore"],
    description: "Cursor ignore file",
  },

  // Build & Verify (3)
  {
    key: "makefile",
    category: "buildVerify",
    label: "Makefile",
    filePaths: ["Makefile"],
    description: "Build automation (make test, make lint)",
  },
  {
    key: "ciWorkflows",
    category: "buildVerify",
    label: "CI/CD",
    filePaths: [".github/workflows"],
    description: "Continuous integration workflows",
  },

  // Documentation (3)
  {
    key: "readme",
    category: "documentation",
    label: "README",
    filePaths: ["README.md", "README.rst", "README"],
    description: "Project overview and getting started",
  },
  {
    key: "contributing",
    category: "documentation",
    label: "CONTRIBUTING",
    filePaths: ["CONTRIBUTING.md", "CONTRIBUTING.rst", ".github/CONTRIBUTING.md"],
    description: "Contribution guidelines and code style",
  },
  {
    key: "additionalDocs",
    category: "documentation",
    label: "Additional Docs",
    filePaths: [], // Detected by .md file scanning, not simple file checks
    description: "Extra documentation (guides, architecture, design docs)",
  },

  // Code Quality (5)
  {
    key: "typeChecking",
    category: "codeQuality",
    label: "Type Checking",
    filePaths: ["tsconfig.json", "mypy.ini", ".mypy.ini", "pyrightconfig.json", ".swiftlint.yml"],
    description: "Static type checking configuration",
  },
  {
    key: "linter",
    category: "codeQuality",
    label: "Linter",
    filePaths: [
      "eslint.config.mjs", "eslint.config.js", "eslint.config.ts",
      ".eslintrc.json", ".eslintrc.js", ".eslintrc.yml",
      ".pylintrc", ".flake8", "golangci.yml", ".golangci.yml",
      "ruff.toml",
    ],
    description: "Code linting configuration",
  },
  {
    key: "formatter",
    category: "codeQuality",
    label: "Formatter",
    filePaths: [
      ".prettierrc", ".prettierrc.json", ".prettierrc.js", ".prettierrc.yml",
      "prettier.config.js", "prettier.config.mjs", "prettier.config.ts",
      "biome.json", "biome.jsonc",
      "rustfmt.toml", ".clang-format", ".editorconfig",
    ],
    description: "Code formatting configuration",
  },
  {
    key: "preCommitHooks",
    category: "codeQuality",
    label: "Pre-commit",
    filePaths: [".pre-commit-config.yaml", ".husky", ".githooks"],
    description: "Pre-commit quality gates",
  },
  {
    key: "testInfra",
    category: "codeQuality",
    label: "Tests",
    filePaths: [
      "jest.config.js", "jest.config.ts", "vitest.config.ts", "vitest.config.js",
      "pytest.ini", "setup.cfg", "conftest.py",
      "phpunit.xml", ".rspec",
    ],
    description: "Test infrastructure and configuration",
  },
];

// Markdown files that are NOT documentation (AI config, templates, boilerplate)
export const NON_DOC_MD_PATTERNS = [
  /^readme/i,
  /^contributing/i,
  /^agents\.md$/i,
  /^claude\.md$/i,
  /^claude\.local\.md$/i,
  /^changelog/i,
  /^license/i,
  /^code.of.conduct/i,
  /^security\.md$/i,
  /pull.request.template/i,
  /issue.template/i,
  /^\.github\//,
];

// Patterns that strongly indicate documentation
export const DOC_MD_PATTERNS = [
  /^architecture/i,
  /^design/i,
  /^development/i,
  /^setup/i,
  /^migration/i,
  /^upgrading/i,
  /^troubleshoot/i,
  /^deployment/i,
  /^configuration/i,
  /^guide/i,
  /^tutorial/i,
  /^faq/i,
  /^getting.started/i,
  /^how.to/i,
  /^docs\//,
];

export function getSkillsByCategory(categoryId: CategoryId): SkillDefinition[] {
  return SKILLS.filter((s) => s.category === categoryId);
}

export function getCategoryForSkill(key: SkillKey): CategoryDefinition {
  const skill = SKILLS.find((s) => s.key === key)!;
  return CATEGORIES.find((c) => c.id === skill.category)!;
}

export const LEVEL_THRESHOLDS: { min: number; max: number; level: Level }[] = [
  { min: 0, max: 2, level: "Novice" },
  { min: 3, max: 5, level: "Apprentice" },
  { min: 6, max: 8, level: "Veteran" },
  { min: 9, max: 11, level: "Elite" },
  { min: 12, max: 13, level: "Heroic" },
  { min: 14, max: 15, level: "Legendary" },
];

export const LEVEL_COLORS: Record<Level, string> = {
  Novice: "#6b7280",
  Apprentice: "#22c55e",
  Veteran: "#3b82f6",
  Elite: "#a855f7",
  Heroic: "#f97316",
  Legendary: "#eab308",
};

export const LEVEL_ORDER: Level[] = [
  "Novice",
  "Apprentice",
  "Veteran",
  "Elite",
  "Heroic",
  "Legendary",
];

export const TOTAL_SKILLS = SKILLS.length; // 15

export const ORG_NAME = "getsentry";

// Map repo slugs/names to avatar images in public/assets/
// Images are keyed by the SDK language or project name
const REPO_IMAGE_MAP: Record<string, string> = {
  "sentry": "/assets/sentry.png",
  "sentry-python": "/assets/python.png",
  "sentry-javascript": "/assets/javascript.png",
  "sentry-java": "/assets/java.png",
  "sentry-cocoa": "/assets/cocoa.png",
  "sentry-react-native": "/assets/react-native.png",
  "sentry-ruby": "/assets/ruby.png",
  "sentry-dotnet": "/assets/dotnet.png",
  "sentry-dart": "/assets/dart.png",
  "sentry-go": "/assets/go.png",
  "sentry-laravel": "/assets/laravel.png",
  "sentry-elixir": "/assets/elixir.png",
  "sentry-unity": "/assets/unity.png",
  "sentry-native": "/assets/native.png",
  "sentry-webpack-plugin": "/assets/webpack.png",
  "relay": "/assets/relay.png",
  "self-hosted": "/assets/self-hosted.png",
  "snuba": "/assets/snuba.png",
};

// Fallback: try to match by language
const LANGUAGE_IMAGE_MAP: Record<string, string> = {
  "Python": "/assets/python.png",
  "TypeScript": "/assets/javascript.png",
  "JavaScript": "/assets/javascript.png",
  "Java": "/assets/java.png",
  "Swift": "/assets/cocoa.png",
  "Objective-C": "/assets/cocoa.png",
  "Ruby": "/assets/ruby.png",
  "C#": "/assets/dotnet.png",
  "Dart": "/assets/dart.png",
  "Go": "/assets/go.png",
  "PHP": "/assets/laravel.png",
  "Elixir": "/assets/elixir.png",
  "C": "/assets/native.png",
  "C++": "/assets/native.png",
  "Rust": "/assets/relay.png",
};

export function getRepoImage(slug: string, language?: string | null): string | null {
  if (REPO_IMAGE_MAP[slug]) return REPO_IMAGE_MAP[slug];
  if (language && LANGUAGE_IMAGE_MAP[language]) return LANGUAGE_IMAGE_MAP[language];
  return null;
}
