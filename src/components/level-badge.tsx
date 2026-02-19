import { Level } from "@/lib/types";
import { LEVEL_COLORS } from "@/lib/constants";
import { Sparkles } from "./sparkles";

interface LevelBadgeProps {
  level: Level;
  size?: "sm" | "md" | "lg";
}

export function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  const color = LEVEL_COLORS[level];

  const sizeClasses = {
    sm: "text-[8px] px-2 py-0.5",
    md: "text-[10px] px-3 py-1",
    lg: "text-xs px-4 py-1.5",
  };

  const badge = (
    <span
      className={`inline-block ${sizeClasses[size]} ${level === "Legendary" ? "legendary-pulse" : ""}`}
      style={{
        color,
        backgroundColor: `${color}15`,
        border: `1px solid ${color}40`,
        textShadow: `0 0 8px ${color}30`,
      }}
    >
      {level}
    </span>
  );

  if (level === "Legendary") {
    return <Sparkles count={4} color={color}>{badge}</Sparkles>;
  }

  return badge;
}
