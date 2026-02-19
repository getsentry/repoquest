"use client";

import { useEffect, useRef, useCallback } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  char: string;
}

const CHARS = ["\u2726", "\u2727", "\u2605", "\u00b7"]; // ✦ ✧ ★ ·
const COLOR = "#eab308";
const MAX_SPARKS = 30;
const SPAWN_INTERVAL = 60; // ms between spawns while moving

export function MouseSparkles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);

  const spawnSpark = useCallback((x: number, y: number) => {
    if (sparksRef.current.length >= MAX_SPARKS) return;

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 0.8;

    sparksRef.current.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5,
      life: 1,
      maxLife: 0.6 + Math.random() * 0.6,
      size: 8 + Math.random() * 8,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawnRef.current < SPAWN_INTERVAL) return;
      lastSpawnRef.current = now;
      spawnSpark(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    let lastTime = performance.now();

    const tick = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const sparks = sparksRef.current;

      // Update sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= dt / s.maxLife;
        if (s.life <= 0) {
          sparks.splice(i, 1);
        }
      }

      // Render
      const children = container.children;
      // Remove excess elements
      while (children.length > sparks.length) {
        container.removeChild(container.lastChild!);
      }
      // Add missing elements
      while (children.length < sparks.length) {
        const el = document.createElement("span");
        el.style.position = "fixed";
        el.style.pointerEvents = "none";
        el.style.zIndex = "9999";
        el.style.color = COLOR;
        el.style.fontFamily = "serif";
        el.style.lineHeight = "1";
        el.setAttribute("aria-hidden", "true");
        container.appendChild(el);
      }
      // Update elements
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        const el = children[i] as HTMLElement;
        el.textContent = s.char;
        el.style.left = `${s.x}px`;
        el.style.top = `${s.y}px`;
        el.style.fontSize = `${s.size}px`;
        el.style.opacity = `${s.life}`;
        el.style.transform = `scale(${0.5 + s.life * 0.5})`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [spawnSpark]);

  return <div ref={containerRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }} />;
}
