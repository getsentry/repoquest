import { SkillSet, CategoryId } from "@/lib/types";
import { CATEGORIES, getSkillsByCategory } from "@/lib/constants";
import { SkillNode } from "./skill-node";

interface SkillTreeProps {
  skills: SkillSet;
  size?: "sm" | "lg";
}

// Layout: 4 category rows, each with its skills spread horizontally.
// AI Config (5): branching tree
// Build (2): horizontal chain
// Docs (3): horizontal chain
// Quality (5): horizontal chain

interface NodeLayout {
  key: string;
  x: number;
  y: number;
}

function getAIConfigLayout(w: number): { nodes: NodeLayout[]; connections: [number, number][] } {
  const cx = w / 2;
  const nodes: NodeLayout[] = [
    { key: "agentsMd", x: cx, y: 30 },
    { key: "claudeMd", x: cx - 100, y: 80 },
    { key: "cursorRulesDir", x: cx + 100, y: 80 },
    { key: "claudeDir", x: cx - 100, y: 130 },
    { key: "cursorignore", x: cx + 100, y: 130 },
  ];
  const connections: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [2, 4],
  ];
  return { nodes, connections };
}

function getChainLayout(category: CategoryId, w: number, yBase: number): { nodes: NodeLayout[]; connections: [number, number][] } {
  const catSkills = getSkillsByCategory(category);
  const count = catSkills.length;
  const spacing = Math.min(100, (w - 80) / (count - 1));
  const startX = (w - spacing * (count - 1)) / 2;

  const nodes: NodeLayout[] = catSkills.map((skill, i) => ({
    key: skill.key,
    x: startX + i * spacing,
    y: yBase,
  }));

  const connections: [number, number][] = [];
  for (let i = 0; i < count - 1; i++) {
    connections.push([i, i + 1]);
  }

  return { nodes, connections };
}

export function SkillTree({ skills, size = "lg" }: SkillTreeProps) {
  const isLarge = size === "lg";
  const w = isLarge ? 520 : 300;

  const isUnlocked = (key: string): boolean => {
    for (const cat of Object.keys(skills) as CategoryId[]) {
      const catObj = skills[cat] as unknown as Record<string, boolean>;
      if (key in catObj) return catObj[key] ?? false;
    }
    return false;
  };

  // AI Config tree layout at top
  const aiLayout = getAIConfigLayout(w);

  // Other categories as chains below
  const buildLayout = getChainLayout("buildVerify", w, 30);
  const docsLayout = getChainLayout("documentation", w, 30);
  const qualityLayout = getChainLayout("codeQuality", w, 30);

  const sections: {
    category: CategoryId;
    label: string;
    color: string;
    nodes: NodeLayout[];
    connections: [number, number][];
    height: number;
    yOffset: number;
  }[] = [
    { category: "aiConfig", label: "AI Config", color: "#818cf8", nodes: aiLayout.nodes, connections: aiLayout.connections, height: 170, yOffset: 0 },
    { category: "buildVerify", label: "Build & Verify", color: "#f472b6", nodes: buildLayout.nodes, connections: buildLayout.connections, height: 80, yOffset: 0 },
    { category: "documentation", label: "Documentation", color: "#34d399", nodes: docsLayout.nodes, connections: docsLayout.connections, height: 80, yOffset: 0 },
    { category: "codeQuality", label: "Code Quality", color: "#fbbf24", nodes: qualityLayout.nodes, connections: qualityLayout.connections, height: 80, yOffset: 0 },
  ];

  // Calculate cumulative y offsets
  let currentY = 0;
  for (const section of sections) {
    section.yOffset = currentY;
    currentY += section.height + 30; // 30px gap between sections
  }

  const totalHeight = currentY - 30;
  const viewBox = `0 0 ${w} ${totalHeight}`;

  const skillMap = Object.fromEntries(
    [...getSkillsByCategory("aiConfig"), ...getSkillsByCategory("buildVerify"), ...getSkillsByCategory("documentation"), ...getSkillsByCategory("codeQuality")]
      .map(s => [s.key, s])
  );

  return (
    <svg viewBox={viewBox} className="w-full" style={{ maxHeight: isLarge ? totalHeight : totalHeight * 0.6 }}>
      {sections.map((section) => (
        <g key={section.category} transform={`translate(0, ${section.yOffset})`}>
          {/* Category label */}
          <text
            x={w / 2}
            y={12}
            textAnchor="middle"
            fill={section.color}
            fontSize="9"
            fontFamily="var(--font-pixel)"
            opacity={0.7}
          >
            {section.label}
          </text>

          {/* Connections */}
          {section.connections.map(([from, to], i) => {
            const fromNode = section.nodes[from];
            const toNode = section.nodes[to];
            const fromUnlocked = isUnlocked(fromNode.key);
            const toUnlocked = isUnlocked(toNode.key);
            const bothUnlocked = fromUnlocked && toUnlocked;

            return (
              <line
                key={i}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={bothUnlocked ? section.color : "#334155"}
                strokeWidth={2}
                strokeDasharray={bothUnlocked ? "none" : "4 4"}
                opacity={bothUnlocked ? 0.6 : 0.2}
              />
            );
          })}

          {/* Nodes */}
          {section.nodes.map((node) => {
            const skill = skillMap[node.key];
            if (!skill) return null;
            const unlocked = isUnlocked(node.key);

            return (
              <SkillNode
                key={node.key}
                label={skill.label}
                skillKey={skill.key}
                unlocked={unlocked}
                x={node.x}
                y={node.y}
                accentColor={section.color}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

// Single-category tree for detail views
interface CategoryTreeProps {
  categoryId: CategoryId;
  skills: SkillSet;
}

export function CategoryTree({ categoryId, skills }: CategoryTreeProps) {
  const category = CATEGORIES.find(c => c.id === categoryId)!;
  const w = 520;

  const isUnlocked = (key: string): boolean => {
    for (const cat of Object.keys(skills) as CategoryId[]) {
      const catObj = skills[cat] as unknown as Record<string, boolean>;
      if (key in catObj) return catObj[key] ?? false;
    }
    return false;
  };

  let layout: { nodes: NodeLayout[]; connections: [number, number][] };
  let height: number;

  if (categoryId === "aiConfig") {
    layout = getAIConfigLayout(w);
    height = 170;
  } else {
    layout = getChainLayout(categoryId, w, 35);
    height = 85;
  }

  const skillMap = Object.fromEntries(
    getSkillsByCategory(categoryId).map(s => [s.key, s])
  );

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ maxHeight: height }}>
      {layout.connections.map(([from, to], i) => {
        const fromNode = layout.nodes[from];
        const toNode = layout.nodes[to];
        const bothUnlocked = isUnlocked(fromNode.key) && isUnlocked(toNode.key);
        return (
          <line
            key={i}
            x1={fromNode.x} y1={fromNode.y}
            x2={toNode.x} y2={toNode.y}
            stroke={bothUnlocked ? category.color : "#334155"}
            strokeWidth={2}
            strokeDasharray={bothUnlocked ? "none" : "4 4"}
            opacity={bothUnlocked ? 0.6 : 0.2}
          />
        );
      })}
      {layout.nodes.map((node) => {
        const skill = skillMap[node.key];
        if (!skill) return null;
        return (
          <SkillNode
            key={node.key}
            label={skill.label}
            skillKey={skill.key}
            unlocked={isUnlocked(node.key)}
            x={node.x}
            y={node.y}
            accentColor={category.color}
          />
        );
      })}
    </svg>
  );
}
