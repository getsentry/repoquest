import { SkillKey } from "@/lib/types";
import { SkillIcon } from "./skill-icons";

interface SkillNodeProps {
  label: string;
  skillKey: SkillKey;
  unlocked: boolean;
  x: number;
  y: number;
  accentColor?: string;
}

export function SkillNode({ label, skillKey, unlocked, x, y, accentColor = "#818cf8" }: SkillNodeProps) {
  const iconColor = unlocked ? "#e2e8f0" : "#475569";
  const textColor = unlocked ? "#e2e8f0" : "#475569";

  return (
    <g>
      {/* Outer glow for unlocked */}
      {unlocked && (
        <>
          <circle cx={x} cy={y} r={30} fill={`${accentColor}08`} />
          <circle cx={x} cy={y} r={26} fill={`${accentColor}10`} />
        </>
      )}

      {/* Hexagonal node */}
      <polygon
        points={hexPoints(x, y, 24)}
        fill={unlocked ? `${accentColor}25` : "#0f172a"}
        stroke={unlocked ? accentColor : "#334155"}
        strokeWidth={unlocked ? 2 : 1.5}
        opacity={unlocked ? 1 : 0.5}
      />

      {/* Inner highlight for unlocked */}
      {unlocked && (
        <polygon
          points={hexPoints(x, y, 20)}
          fill={`${accentColor}10`}
          stroke={`${accentColor}30`}
          strokeWidth={0.5}
        />
      )}

      {/* Skill icon */}
      <SkillIcon
        skillKey={skillKey}
        x={x}
        y={y}
        color={iconColor}
        size={unlocked ? 20 : 16}
      />

      {/* Lock overlay for locked nodes */}
      {!unlocked && (
        <>
          <circle cx={x + 10} cy={y + 10} r={5} fill="#0f172a" stroke="#334155" strokeWidth={1} />
          <text x={x + 10} y={y + 12} textAnchor="middle" fill="#475569" fontSize="6">
            🔒
          </text>
        </>
      )}

      {/* Label below */}
      <text
        x={x}
        y={y + 38}
        textAnchor="middle"
        fill={textColor}
        fontSize="8"
        fontFamily="var(--font-pixel)"
      >
        {label}
      </text>
    </g>
  );
}

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}
