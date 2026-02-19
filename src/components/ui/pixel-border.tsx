import { ReactNode } from "react";

interface PixelBorderProps {
  children: ReactNode;
  className?: string;
  gold?: boolean;
}

export function PixelBorder({
  children,
  className = "",
  gold = false,
}: PixelBorderProps) {
  return (
    <div className={`${gold ? "wood-frame-gold" : "wood-frame"} ${className}`}>
      {children}
    </div>
  );
}
