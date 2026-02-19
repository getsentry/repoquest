import { graphql } from "@octokit/graphql";
import { writeFileSync } from "fs";
import { join } from "path";
import {
  Repository,
  SkillSet,
  RepoData,
  MarkdownFile,
} from "../src/lib/types";
import { calculateLevel, countSkills, getCategoryScores } from "../src/lib/utils";
import { SKILLS, ORG_NAME, NON_DOC_MD_PATTERNS, DOC_MD_PATTERNS } from "../src/lib/constants";

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("Error: GITHUB_TOKEN environment variable is required");
  process.exit(1);
}

const gql = graphql.defaults({
  headers: { authorization: `token ${token}` },
});

interface RepoNode {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  primaryLanguage: { name: string } | null;
}

// Phase A: Fetch all public repos with pagination
async function fetchAllRepos(): Promise<RepoNode[]> {
  const repos: RepoNode[] = [];
  let cursor: string | null = null;
  let hasNext = true;

  console.log(`Fetching public repos for ${ORG_NAME}...`);

  while (hasNext) {
    const query = `
      query($org: String!, $cursor: String) {
        organization(login: $org) {
          repositories(
            first: 100
            after: $cursor
            privacy: PUBLIC
            orderBy: { field: STARGAZERS, direction: DESC }
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              name
              description
              url
              stargazerCount
              primaryLanguage { name }
            }
          }
        }
      }
    `;

    const result: any = await gql(query, { org: ORG_NAME, cursor });

    const { nodes, pageInfo } = result.organization.repositories;

    // Since results are ordered by stars DESC, stop once we drop below the minimum
    const MIN_STARS = 100;
    for (const node of nodes) {
      if (node.stargazerCount < MIN_STARS) {
        hasNext = false;
        break;
      }
      repos.push(node);
    }

    if (hasNext) {
      hasNext = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;
    }

    console.log(`  Fetched ${repos.length} repos so far (≥${MIN_STARS} stars)...`);
  }

  console.log(`Total repos found: ${repos.length} (with ≥10 stars)`);
  return repos;
}

// Build file check fields for skills that have filePaths.
// additionalDocs is handled separately via tree scanning.
function buildFileChecks(alias: string): string {
  const fields: string[] = [];

  for (const skill of SKILLS) {
    if (skill.filePaths.length === 0) continue; // additionalDocs — handled by tree scan
    for (let i = 0; i < skill.filePaths.length; i++) {
      const fieldName = `${alias}_${skill.key}_${i}`;
      const expression = `HEAD:${skill.filePaths[i]}`;
      fields.push(
        `${fieldName}: object(expression: "${expression}") { __typename }`
      );
    }
  }

  // Also fetch root tree entries to find all .md files
  fields.push(`${alias}_rootTree: object(expression: "HEAD:") {
    ... on Tree {
      entries { name type }
    }
  }`);

  // And docs/ directory tree if it exists
  fields.push(`${alias}_docsTree: object(expression: "HEAD:docs") {
    ... on Tree {
      entries { name type }
    }
  }`);

  return fields.join("\n      ");
}

// Classify a markdown file path
function classifyMdFile(path: string): MarkdownFile["classification"] {
  const name = path.split("/").pop() || path;

  if (/^readme/i.test(name)) return "readme";
  if (/^contributing/i.test(name)) return "contributing";
  if (/^(agents|claude|claude\.local)\.md$/i.test(name)) return "ai-config";
  if (DOC_MD_PATTERNS.some((p) => p.test(path))) return "docs";

  // If it's in docs/ directory, it's documentation
  if (path.startsWith("docs/")) return "docs";

  // If it doesn't match non-doc patterns, classify as docs
  if (!NON_DOC_MD_PATTERNS.some((p) => p.test(path))) return "docs";

  return "other";
}

// Parse results for a single repo
function parseSkillResults(
  alias: string,
  repoData: any
): { skills: SkillSet; markdownFiles: MarkdownFile[] } {
  const skillFlags: Record<string, boolean> = {};

  // Check file-path-based skills
  for (const skill of SKILLS) {
    if (skill.filePaths.length === 0) continue;
    let found = false;
    for (let i = 0; i < skill.filePaths.length; i++) {
      const fieldName = `${alias}_${skill.key}_${i}`;
      if (repoData[fieldName] !== null) {
        found = true;
        break;
      }
    }
    skillFlags[skill.key] = found;
  }

  // Scan root tree for .md files
  const markdownFiles: MarkdownFile[] = [];
  const rootTree = repoData[`${alias}_rootTree`];
  if (rootTree?.entries) {
    for (const entry of rootTree.entries) {
      if (
        entry.type === "blob" &&
        entry.name.toLowerCase().endsWith(".md")
      ) {
        markdownFiles.push({
          path: entry.name,
          classification: classifyMdFile(entry.name),
        });
      }
    }
  }

  // Scan docs/ directory for .md files
  const docsTree = repoData[`${alias}_docsTree`];
  if (docsTree?.entries) {
    for (const entry of docsTree.entries) {
      if (
        entry.type === "blob" &&
        entry.name.toLowerCase().endsWith(".md")
      ) {
        const fullPath = `docs/${entry.name}`;
        markdownFiles.push({
          path: fullPath,
          classification: classifyMdFile(fullPath),
        });
      }
    }
  }

  // additionalDocs: true if there are .md files classified as "docs"
  const docFiles = markdownFiles.filter((f) => f.classification === "docs");
  skillFlags.additionalDocs = docFiles.length > 0;

  const skills: SkillSet = {
    aiConfig: {
      agentsMd: skillFlags.agentsMd ?? false,
      claudeMd: skillFlags.claudeMd ?? false,
      claudeDir: skillFlags.claudeDir ?? false,
      claudeSettings: skillFlags.claudeSettings ?? false,
      claudeCommands: skillFlags.claudeCommands ?? false,
      claudeSkills: skillFlags.claudeSkills ?? false,
      cursorRulesDir: skillFlags.cursorRulesDir ?? false,
    },
    buildVerify: {
      makefile: skillFlags.makefile ?? false,
      ciWorkflows: skillFlags.ciWorkflows ?? false,
    },
    documentation: {
      readme: skillFlags.readme ?? false,
      contributing: skillFlags.contributing ?? false,
      additionalDocs: skillFlags.additionalDocs ?? false,
    },
    codeQuality: {
      typeChecking: skillFlags.typeChecking ?? false,
      linter: skillFlags.linter ?? false,
      formatter: skillFlags.formatter ?? false,
      preCommitHooks: skillFlags.preCommitHooks ?? false,
      testInfra: skillFlags.testInfra ?? false,
    },
  };

  return { skills, markdownFiles };
}

function createEmptySkillSet(): SkillSet {
  return {
    aiConfig: {
      agentsMd: false, claudeMd: false, claudeDir: false,
      claudeSettings: false, claudeCommands: false, claudeSkills: false,
      cursorRulesDir: false,
    },
    buildVerify: {
      makefile: false, ciWorkflows: false,
    },
    documentation: {
      readme: false, contributing: false, additionalDocs: false,
    },
    codeQuality: {
      typeChecking: false, linter: false, formatter: false,
      preCommitHooks: false, testInfra: false,
    },
  };
}

// Phase B: Check files for a batch of repos (3 at a time)
async function checkFilesForBatch(
  repos: RepoNode[]
): Promise<Map<string, { skills: SkillSet; markdownFiles: MarkdownFile[] }>> {
  const results = new Map<string, { skills: SkillSet; markdownFiles: MarkdownFile[] }>();

  const fragments = repos.map((repo, i) => {
    const alias = `repo${i}`;
    const fileChecks = buildFileChecks(alias);
    return `
    ${alias}: repository(owner: "${ORG_NAME}", name: "${repo.name}") {
      ${fileChecks}
    }`;
  });

  const query = `query { ${fragments.join("\n")} }`;

  try {
    const result: any = await gql(query);

    repos.forEach((repo, i) => {
      const alias = `repo${i}`;
      const repoData = result[alias];

      if (!repoData) {
        results.set(repo.name, { skills: createEmptySkillSet(), markdownFiles: [] });
        return;
      }

      results.set(repo.name, parseSkillResults(alias, repoData));
    });
  } catch (error: any) {
    console.warn(
      `  Warning: batch query failed for [${repos.map((r) => r.name).join(", ")}]: ${error.message}`
    );
    repos.forEach((repo) => {
      results.set(repo.name, { skills: createEmptySkillSet(), markdownFiles: [] });
    });
  }

  return results;
}

// Phase C: Assemble final JSON
async function main() {
  const repoNodes = await fetchAllRepos();

  console.log("\nChecking files across 4 categories (17 skills) + scanning .md files...");

  const allResults = new Map<string, { skills: SkillSet; markdownFiles: MarkdownFile[] }>();
  const batchSize = 3;

  for (let i = 0; i < repoNodes.length; i += batchSize) {
    const batch = repoNodes.slice(i, i + batchSize);
    const batchResults = await checkFilesForBatch(batch);

    for (const [name, result] of batchResults) {
      allResults.set(name, result);
    }

    const progress = Math.min(i + batchSize, repoNodes.length);
    process.stdout.write(
      `\r  Checked ${progress}/${repoNodes.length} repos...`
    );
  }

  console.log("\n\nAssembling data...");

  const repositories: Repository[] = repoNodes.map((repo) => {
    const result = allResults.get(repo.name) || {
      skills: createEmptySkillSet(),
      markdownFiles: [],
    };
    const skillCount = countSkills(result.skills);
    const level = calculateLevel(skillCount);
    const categoryScores = getCategoryScores(result.skills);

    return {
      name: repo.name,
      slug: repo.name.toLowerCase(),
      description: repo.description,
      url: repo.url,
      stars: repo.stargazerCount,
      language: repo.primaryLanguage?.name || null,
      skills: result.skills,
      skillCount,
      categoryScores,
      level,
      markdownFiles: result.markdownFiles,
    };
  });

  repositories.sort((a, b) => {
    if (b.skillCount !== a.skillCount) return b.skillCount - a.skillCount;
    return b.stars - a.stars;
  });

  const data: RepoData = {
    lastUpdated: new Date().toISOString(),
    orgName: ORG_NAME,
    repositories,
  };

  const outPath = join(process.cwd(), "data", "repos.json");
  writeFileSync(outPath, JSON.stringify(data, null, 2));

  // Print summary
  const totalDocFiles = repositories.reduce((s, r) => s + r.markdownFiles.filter(f => f.classification === "docs").length, 0);
  console.log(`\nData written to ${outPath}`);
  console.log(`  Total repos: ${repositories.length}`);
  console.log(`  Repos with any skill: ${repositories.filter((r) => r.skillCount > 0).length}`);
  console.log(`  Legendary repos: ${repositories.filter((r) => r.level === "Legendary").length}`);
  console.log(`  Total doc .md files found: ${totalDocFiles}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
