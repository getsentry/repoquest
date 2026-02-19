"use client";

import Link from "next/link";
import { getLastUpdated } from "@/lib/data";
import { MusicPlayer } from "./music-player";
import { Sparkles } from "./sparkles";

export function Header() {
  const lastUpdated = getLastUpdated();
  const formattedDate = new Date(lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="border-b border-wood-mid/30 bg-rpg-panel/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-rpg-gold hover:text-rpg-gold/80 transition-colors"
          >
            <Sparkles count={3}>REPOQUEST</Sparkles>
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/"
              className="text-sm text-rpg-muted hover:text-rpg-accent transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/stats"
              className="text-sm text-rpg-muted hover:text-rpg-accent transition-colors"
            >
              Stats
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <MusicPlayer />
          <div className="text-xs text-rpg-muted hidden sm:block">
            Updated {formattedDate}
          </div>
        </div>
      </div>
    </header>
  );
}
