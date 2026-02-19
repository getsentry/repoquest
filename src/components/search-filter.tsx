"use client";

import { Level } from "@/lib/types";
import { LEVEL_ORDER, LEVEL_COLORS } from "@/lib/constants";

interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeLevel: Level | null;
  onLevelChange: (level: Level | null) => void;
  languages: string[];
  activeLanguage: string | null;
  onLanguageChange: (language: string | null) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function SearchFilter({
  search,
  onSearchChange,
  activeLevel,
  onLevelChange,
  languages,
  activeLanguage,
  onLanguageChange,
  sortBy,
  onSortChange,
}: SearchFilterProps) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search repos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 rounded border border-wood-mid/40 bg-rpg-panel px-3 py-2 text-sm text-rpg-text placeholder-rpg-muted outline-none transition-all"
        />
        <select
          value={activeLanguage || ""}
          onChange={(e) => onLanguageChange(e.target.value || null)}
          className="rounded border border-wood-mid/40 bg-rpg-panel px-3 py-2 text-sm text-rpg-text outline-none transition-all"
        >
          <option value="">All Languages</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded border border-wood-mid/40 bg-rpg-panel px-3 py-2 text-sm text-rpg-text outline-none transition-all"
        >
          <option value="skillCount">Sort: Skill Count</option>
          <option value="stars">Sort: Stars</option>
          <option value="name">Sort: Name</option>
          <option value="level">Sort: Level</option>
        </select>
      </div>

      {/* Level toggles */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onLevelChange(null)}
          className={`rounded px-3 py-1 text-xs transition-all border ${
            activeLevel === null
              ? "bg-wood-mid border-wood-highlight text-rpg-text"
              : "bg-rpg-panel border-wood-dark/30 text-rpg-muted hover:text-rpg-text hover:border-wood-mid"
          }`}
        >
          All
        </button>
        {LEVEL_ORDER.map((level) => (
          <button
            key={level}
            onClick={() =>
              onLevelChange(activeLevel === level ? null : level)
            }
            className="rounded px-3 py-1 text-xs transition-all border"
            style={{
              backgroundColor:
                activeLevel === level ? LEVEL_COLORS[level] : undefined,
              color:
                activeLevel === level ? "#fff" : LEVEL_COLORS[level],
              borderColor: activeLevel === level
                ? LEVEL_COLORS[level]
                : `${LEVEL_COLORS[level]}40`,
            }}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
