import { ReactNode } from "react";
import { PixelBorder } from "./pixel-border";
import { SparkleOverlay } from "../sparkles";

interface PixelCardProps {
  children: ReactNode;
  className?: string;
  gold?: boolean;
  hover?: boolean;
  sparkle?: boolean;
}

export function PixelCard({
  children,
  className = "",
  gold = false,
  hover = false,
  sparkle = false,
}: PixelCardProps) {
  const hoverClass = hover ? "hover-lift" : "";

  return (
    <PixelBorder gold={gold} className={hoverClass}>
      <div className={`p-4 relative ${className}`}>
        {sparkle && <SparkleOverlay count={6} />}
        {children}
      </div>
    </PixelBorder>
  );
}
