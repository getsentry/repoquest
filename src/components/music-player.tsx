"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = new Audio("/music/background.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = "none";
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => setReady(true));

    // Restore preference
    const pref = localStorage.getItem("music");
    if (pref === "on") {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      localStorage.setItem("music", "off");
    } else {
      audio.play().then(() => {
        setPlaying(true);
        localStorage.setItem("music", "on");
      }).catch(() => {});
    }
  }, [playing]);

  return (
    <button
      onClick={toggle}
      className="group relative flex items-center gap-2 rounded border border-wood-mid/40 bg-rpg-panel px-2.5 py-1.5 text-xs transition-all hover:border-wood-highlight"
      title={playing ? "Mute music" : "Play music"}
    >
      {/* Speaker icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        className="text-rpg-muted group-hover:text-rpg-accent transition-colors"
      >
        {/* Speaker body */}
        <path
          d="M2 5.5h2.5L8 2.5v11L4.5 10.5H2a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5z"
          fill="currentColor"
        />
        {playing ? (
          <>
            {/* Sound waves */}
            <path
              d="M10 5.5c.8.5 1.3 1.4 1.3 2.5s-.5 2-1.3 2.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M11.5 3.5c1.3.9 2 2.4 2 4.5s-.7 3.6-2 4.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            {/* Mute X */}
            <path
              d="M10 5l4 6M14 5l-4 6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
      <span className="text-rpg-muted group-hover:text-rpg-accent transition-colors hidden sm:inline">
        {playing ? "♫" : "Off"}
      </span>
      {/* Pixel equalizer bars when playing */}
      {playing && (
        <span className="flex items-end gap-[2px] h-3">
          <span className="w-[3px] bg-rpg-gold animate-eq-1" />
          <span className="w-[3px] bg-rpg-gold animate-eq-2" />
          <span className="w-[3px] bg-rpg-gold animate-eq-3" />
        </span>
      )}
    </button>
  );
}
