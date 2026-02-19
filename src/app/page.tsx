"use client";

import { useState, useMemo } from "react";
import { getAllRepos, getOrgStats } from "@/lib/data";
import { Level } from "@/lib/types";
import { LEVEL_ORDER } from "@/lib/constants";
import { OrgStatsSummary } from "@/components/org-stats-summary";
import { SearchFilter } from "@/components/search-filter";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { Sparkles } from "@/components/sparkles";

const PAGE_SIZE = 25;

export default function HomePage() {
  const allRepos = getAllRepos();
  const stats = getOrgStats();

  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("skillCount");
  const [page, setPage] = useState(1);

  const languages = useMemo(() => {
    const langs = new Set(
      allRepos.map((r) => r.language).filter(Boolean) as string[]
    );
    return Array.from(langs).sort();
  }, [allRepos]);

  const filtered = useMemo(() => {
    let repos = [...allRepos];

    if (search) {
      const q = search.toLowerCase();
      repos = repos.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q)
      );
    }

    if (activeLevel) {
      repos = repos.filter((r) => r.level === activeLevel);
    }

    if (activeLanguage) {
      repos = repos.filter((r) => r.language === activeLanguage);
    }

    repos.sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return b.stars - a.stars;
        case "name":
          return a.name.localeCompare(b.name);
        case "level":
          return LEVEL_ORDER.indexOf(b.level) - LEVEL_ORDER.indexOf(a.level);
        case "skillCount":
        default:
          if (b.skillCount !== a.skillCount)
            return b.skillCount - a.skillCount;
          return b.stars - a.stars;
      }
    });

    return repos;
  }, [allRepos, search, activeLevel, activeLanguage, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePageNumber = Math.min(page, totalPages);
  const paged = filtered.slice(
    (safePageNumber - 1) * PAGE_SIZE,
    safePageNumber * PAGE_SIZE
  );
  const startRank = (safePageNumber - 1) * PAGE_SIZE + 1;

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };
  const handleLevelChange = (l: Level | null) => { setActiveLevel(l); setPage(1); };
  const handleLanguageChange = (l: string | null) => { setActiveLanguage(l); setPage(1); };
  const handleSortChange = (s: string) => { setSortBy(s); setPage(1); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <img
          src="/logo.png"
          alt="RepoQuest"
          className="mx-auto mb-4 h-96 animate-logo-breathe"
        />
        <p className="text-sm text-rpg-muted">
          Tracking 15 AI readiness signals across getsentry repos
        </p>
      </div>

      <OrgStatsSummary stats={stats} />

      <SearchFilter
        search={search}
        onSearchChange={handleSearchChange}
        activeLevel={activeLevel}
        onLevelChange={handleLevelChange}
        languages={languages}
        activeLanguage={activeLanguage}
        onLanguageChange={handleLanguageChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <div className="wood-frame">
        <LeaderboardTable
          repos={paged}
          startRank={startRank}
          filterKey={`${search}|${activeLevel}|${activeLanguage}|${sortBy}|${safePageNumber}`}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, safePageNumber - 1))}
            disabled={safePageNumber <= 1}
            className="rounded border border-wood-mid/30 bg-rpg-panel px-4 py-1.5 text-xs text-rpg-muted hover:text-rpg-text hover:border-wood-highlight transition-all disabled:opacity-30"
          >
            Prev
          </button>
          <span className="text-xs text-rpg-muted font-mono">
            {safePageNumber} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, safePageNumber + 1))}
            disabled={safePageNumber >= totalPages}
            className="rounded border border-wood-mid/30 bg-rpg-panel px-4 py-1.5 text-xs text-rpg-muted hover:text-rpg-text hover:border-wood-highlight transition-all disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      <div className="text-center text-xs text-rpg-muted">
        Showing {paged.length} of {filtered.length} repos
      </div>
    </div>
  );
}
