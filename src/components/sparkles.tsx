"use client";

import { useState, useEffect, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  char: string;
}

interface SparklesProps {
  children: React.ReactNode;
  count?: number;
  color?: string;
  className?: string;
}

let nextId = 0;

export function Sparkles({
  children,
  count = 6,
  color = "#eab308",
  className = "",
}: SparklesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const generateParticles = useCallback(() => {
    const chars = ["\u2726", "\u2727", "\u2605", "\u00b7"]; // ✦ ✧ ★ ·
    return Array.from({ length: count }, () => ({
      id: nextId++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 6 + Math.random() * 6,
      duration: 1.5 + Math.random() * 2,
      delay: Math.random() * 3,
      char: chars[Math.floor(Math.random() * chars.length)],
    }));
  }, [count]);

  useEffect(() => {
    setParticles(generateParticles());

    const interval = setInterval(() => {
      setParticles(generateParticles());
    }, 4000);

    return () => clearInterval(interval);
  }, [generateParticles]);

  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      {particles.map((p) => (
        <span
          key={p.id}
          aria-hidden
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            color,
            pointerEvents: "none",
            animation: `sparkle-pop ${p.duration}s steps(3) ${p.delay}s infinite`,
            zIndex: 2,
            lineHeight: 1,
          }}
        >
          {p.char}
        </span>
      ))}
    </span>
  );
}

interface SparkleOverlayProps {
  count?: number;
  color?: string;
}

/**
 * Fills its parent (which must be position:relative) with random sparkle particles.
 */
export function SparkleOverlay({ count = 8, color = "#eab308" }: SparkleOverlayProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const generateParticles = useCallback(() => {
    const chars = ["\u2726", "\u2727", "\u00b7"];
    return Array.from({ length: count }, () => ({
      id: nextId++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 6 + Math.random() * 5,
      duration: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 3,
      char: chars[Math.floor(Math.random() * chars.length)],
    }));
  }, [count]);

  useEffect(() => {
    setParticles(generateParticles());

    const interval = setInterval(() => {
      setParticles(generateParticles());
    }, 4000);

    return () => clearInterval(interval);
  }, [generateParticles]);

  return (
    <>
      {particles.map((p) => (
        <span
          key={p.id}
          aria-hidden
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            color,
            pointerEvents: "none",
            animation: `sparkle-pop ${p.duration}s steps(3) ${p.delay}s infinite`,
            zIndex: 2,
            lineHeight: 1,
          }}
        >
          {p.char}
        </span>
      ))}
    </>
  );
}
