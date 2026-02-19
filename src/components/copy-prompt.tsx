"use client";

import { useState } from "react";
import { Repository, SkillKey } from "@/lib/types";
import { SKILLS, CATEGORIES, getSkillsByCategory } from "@/lib/constants";
import { getSkillValue } from "@/lib/utils";

interface CopyPromptProps {
  repo: Repository;
}

function getPromptForSkill(skillKey: SkillKey, repo: Repository): string | null {
  const lang = repo.language || "the project's language";
  const name = repo.name;

  const prompts: Partial<Record<SkillKey, string>> = {
    agentsMd: `Create an AGENTS.md file for the ${name} repository (${lang}). This file should contain vendor-neutral instructions for AI coding agents, including:
- Project overview and architecture
- Key conventions and patterns used in the codebase
- How to build, test, and lint the project
- Important directories and their purposes
- Common pitfalls and things to avoid`,

    claudeMd: `Create a CLAUDE.md file for the ${name} repository (${lang}). This file should contain instructions specifically for Claude Code, including:
- Build and test commands (how to run the full suite and individual tests)
- Code style and conventions
- Project structure overview
- Key architectural decisions
- Common workflows and debugging tips`,

    claudeDir: `Set up a .claude/ configuration directory for the ${name} repository (${lang}). Create .claude/settings.json with appropriate project settings for Claude Code, including allowed tools and permissions.`,

    cursorRulesDir: `Set up a .cursor/rules/ directory for the ${name} repository (${lang}). Create rule files covering:
- Code style and conventions
- Architecture patterns
- Testing guidelines
- Common operations and workflows`,

    claudeSettings: `Create a .claude/settings.json file for the ${name} repository (${lang}). This file should configure Claude Code project settings, including:
- Allowed and denied tools/permissions
- Project-specific preferences
- Custom instructions or references`,

    claudeCommands: `Create a .claude/commands/ directory for the ${name} repository (${lang}). Add custom slash commands as markdown files, for example:
- .claude/commands/test.md — Run the test suite with common flags
- .claude/commands/lint-fix.md — Run linter and auto-fix issues
- .claude/commands/deploy.md — Steps to deploy the project`,

    claudeSkills: `Create a .claude/skills/ directory for the ${name} repository (${lang}). Add reusable skill files that Claude can invoke, for example:
- .claude/skills/debug.md — Debugging workflow for common issues
- .claude/skills/review.md — Code review checklist and patterns
- .claude/skills/refactor.md — Refactoring guidelines and patterns`,

    makefile: `Create a Makefile for the ${name} repository (${lang}). Include targets for:
- \`make setup\` - Install dependencies and set up the development environment
- \`make test\` - Run the test suite
- \`make lint\` - Run linters
- \`make format\` - Run code formatters
- \`make build\` - Build the project
- \`make clean\` - Clean build artifacts`,

    readme: `Create a comprehensive README.md for the ${name} repository (${lang}). Include:
- Project description and purpose
- Installation instructions
- Quick start / getting started guide
- Configuration options
- Contributing guidelines link
- License information`,

    contributing: `Create a CONTRIBUTING.md for the ${name} repository (${lang}). Include:
- How to set up the development environment
- Code style guidelines
- How to run tests
- Pull request process
- Issue reporting guidelines
- Code of conduct reference`,

    additionalDocs: `Create documentation files for the ${name} repository (${lang}). Add a docs/ directory with:
- docs/architecture.md - System architecture and design decisions
- docs/development.md - Detailed development setup and workflow guide
- docs/getting-started.md - Tutorial for new contributors`,

    typeChecking: `Set up type checking for the ${name} repository (${lang}). ${
      lang === "Python" ? "Create a mypy.ini or pyrightconfig.json with strict type checking settings." :
      lang === "TypeScript" || lang === "JavaScript" ? "Create or update tsconfig.json with strict type checking enabled." :
      `Configure appropriate type checking tools for ${lang}.`
    }`,

    linter: `Set up a linter for the ${name} repository (${lang}). ${
      lang === "Python" ? "Create a ruff.toml or .flake8 configuration with appropriate rules." :
      lang === "TypeScript" || lang === "JavaScript" ? "Create an eslint.config.mjs with recommended rules for the project." :
      lang === "Go" ? "Create a .golangci.yml with recommended linters enabled." :
      `Configure an appropriate linter for ${lang}.`
    }`,

    formatter: `Set up a code formatter for the ${name} repository (${lang}). ${
      lang === "Python" ? "Configure ruff format or black in pyproject.toml." :
      lang === "TypeScript" || lang === "JavaScript" ? "Create a .prettierrc with consistent formatting rules." :
      lang === "Rust" ? "Create a rustfmt.toml with project formatting preferences." :
      `Configure an appropriate formatter for ${lang}. Also consider adding an .editorconfig for editor-agnostic settings.`
    }`,

    preCommitHooks: `Set up pre-commit hooks for the ${name} repository (${lang}). ${
      lang === "TypeScript" || lang === "JavaScript" ? "Install husky and lint-staged, configure in package.json to run linting and formatting on staged files." :
      "Create a .pre-commit-config.yaml with hooks for linting, formatting, and common checks (trailing whitespace, merge conflicts, etc.)."
    }`,

    testInfra: `Set up test infrastructure for the ${name} repository (${lang}). ${
      lang === "Python" ? "Create a pytest.ini or conftest.py with test configuration, fixtures, and coverage settings." :
      lang === "TypeScript" || lang === "JavaScript" ? "Create a vitest.config.ts (or jest.config.ts) with test configuration and coverage settings." :
      `Configure appropriate testing tools for ${lang} with test configuration and coverage.`
    }`,
  };

  return prompts[skillKey] || null;
}

export function CopyPrompt({ repo }: CopyPromptProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Collect all missing skills
  const missingSkills = SKILLS.filter((skill) => !getSkillValue(repo.skills, skill.key));

  if (missingSkills.length === 0) return null;

  const handleCopy = (skillKey: SkillKey, prompt: string) => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(skillKey);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleCopyAll = () => {
    const allPrompts = missingSkills
      .map((skill) => {
        const prompt = getPromptForSkill(skill.key, repo);
        return prompt ? `## ${skill.label}\n${prompt}` : null;
      })
      .filter(Boolean)
      .join("\n\n---\n\n");

    const fullPrompt = `I want to improve the AI readiness of the ${repo.name} repository (${repo.language || "unknown language"}). Please help me create the following missing files and configurations:\n\n${allPrompts}`;

    navigator.clipboard.writeText(fullPrompt).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  // Group by category
  const missingByCategory = CATEGORIES.map((cat) => ({
    category: cat,
    skills: missingSkills.filter((s) => s.category === cat.id),
  })).filter((g) => g.skills.length > 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs text-rpg-gold">
          Level Up — Missing Skills
        </h2>
        <button
          onClick={handleCopyAll}
          className="text-xs px-3 py-1.5 border border-rpg-gold/40 text-rpg-gold hover:bg-rpg-gold/10 transition-all"
        >
          {copiedAll ? "Copied!" : "Copy All Prompts"}
        </button>
      </div>

      {missingByCategory.map(({ category: cat, skills }) => (
        <div key={cat.id} className="space-y-1.5">
          <div className="text-xs" style={{ color: cat.color }}>
            {cat.label}
          </div>
          {skills.map((skill) => {
            const prompt = getPromptForSkill(skill.key, repo);
            if (!prompt) return null;

            return (
              <div
                key={skill.key}
                className="flex items-center justify-between gap-3 px-3 py-2 bg-rpg-bg/40 border border-wood-dark/20"
              >
                <div className="min-w-0">
                  <div className="text-sm text-rpg-text">{skill.label}</div>
                  <div className="text-xs text-rpg-muted truncate">
                    {skill.description}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(skill.key, prompt)}
                  className="flex-shrink-0 text-xs px-2.5 py-1 border border-wood-mid/40 text-rpg-accent hover:text-rpg-gold hover:border-wood-highlight transition-all"
                >
                  {copied === skill.key ? "Copied!" : "Copy"}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
