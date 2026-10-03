import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Música de fondo: "En Cuerpo y Alma" — Metanoia.
 * Usa un reproductor de YouTube oculto (IFrame API) controlado por un botón flotante.
 * Los navegadores bloquean el audio automático, por eso la música arranca con la
 * primera interacción del invitado (toque, clic o tecla) y puede pausarse cuando quiera.
 */

const VIDEO_ID = "bx_N3s0X12s";
const TITLE = "En Cuerpo y Alma";
const ARTIST = "Metanoia";

type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(s: number, allowSeekAhead: boolean): void;
  setVolume(v: number): void;
  destroy(): void;
};

type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      width?: number;
      height?: number;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT!);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return apiPromise;
}

export function BackgroundMusic() {
  const hostRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const userPausedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Crear el reproductor oculto
  useEffect(() => {
    let cancelled = false;
    loadYouTubeApi().then((YT) => {
      if (cancelled || !hostRef.current) return;
      playerRef.current = new YT.Player(hostRef.current, {
        videoId: VIDEO_ID,
        width: 1,
        height: 1,
        playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: VIDEO_ID, playsinline: 1, rel: 0 },
        events: {
          onReady: () => {
            playerRef.current?.setVolume(70);
            setReady(true);
          },
          onStateChange: ({ data }) => {
            if (data === 1) setPlaying(true); // PLAYING
            else if (data === 2) setPlaying(false); // PAUSED
            else if (data === 0) playerRef.current?.seekTo(0, true); // ENDED → repetir
          },
        },
      });
    });
    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  // Arrancar con la primera interacción del invitado (si no la pausó él mismo)
  useEffect(() => {
    if (!ready) return;
    const start = (e: Event) => {
      if (btnRef.current?.contains(e.target as Node)) return; // el botón maneja su propio clic
      if (!userPausedRef.current) playerRef.current?.playVideo();
      remove();
    };
    const remove = () => {
      window.removeEventListener("pointerdown", start, true);
      window.removeEventListener("keydown", start, true);
    };
    window.addEventListener("pointerdown", start, true);
    window.addEventListener("keydown", start, true);
    return remove;
  }, [ready]);

  // Pausar si el invitado cambia de pestaña y retomar al volver
  useEffect(() => {
    let wasPlaying = false;
    const onVis = () => {
      if (document.hidden) {
        wasPlaying = playing;
        if (playing) playerRef.current?.pauseVideo();
      } else if (wasPlaying && !userPausedRef.current) {
        playerRef.current?.playVideo();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [playing]);

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) {
      userPausedRef.current = true;
      p.pauseVideo();
    } else {
      userPausedRef.current = false;
      p.playVideo();
    }
  }, [playing]);

  return (
    <>
      {/* Reproductor oculto */}
      <div aria-hidden="true" className="pointer-events-none fixed bottom-0 left-0 h-px w-px overflow-hidden opacity-0">
        <div ref={hostRef} />
      </div>

      <button
        ref={btnRef}
        id="toggle-musica"
        type="button"
        onClick={toggle}
        disabled={!ready}
        aria-pressed={playing}
        aria-label={playing ? `Pausar música: ${TITLE} de ${ARTIST}` : `Reproducir música: ${TITLE} de ${ARTIST}`}
        className="music-pill fixed right-3 top-3 z-40 flex items-center gap-3 rounded-full border border-gold/60 bg-background/80 py-2 pl-2 pr-4 text-left text-gold backdrop-blur transition hover:bg-gold/15 focus-visible:outline-2 focus-visible:outline-ivory disabled:opacity-60"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-primary-foreground">
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
          )}
        </span>
        <span className="leading-tight">
          <span className="block font-serif text-base font-semibold text-ivory">{TITLE}</span>
          <span className="block text-xs text-muted-foreground">{ARTIST}</span>
        </span>
        <span aria-hidden="true" className={`eq ${playing ? "eq-on" : ""}`}>
          <i /><i /><i />
        </span>
      </button>
    </>
  );
}
