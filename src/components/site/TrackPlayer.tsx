import { prominent } from "color.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextMorph } from "torph/react";
import { getTranslator } from "@/lib/i18n";

interface LanyardSpotify {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

interface LanyardPresence {
  spotify?: LanyardSpotify;
  listening_to_spotify: boolean;
  user_id: string;
}

interface WebSocketMessage {
  op: number;
  t?: "INIT_STATE" | "PRESENCE_UPDATE";
  d: LanyardPresence | { heartbeat_interval: number };
}

interface Props {
  id: string;
  locale: string | undefined;
  initialPresence: LanyardPresence;
}

interface TrackProgress {
  start: number;
  end: number;
  progress: number;
}

const WAVE_COUNT = 6;

const normalizeColor = (rgbString: string): string => {
  const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return rgbString;

  const [r, g, b] = [
    parseInt(match[1], 10),
    parseInt(match[2], 10),
    parseInt(match[3], 10),
  ];

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  const factor = 0.5 / luminance;
  let nr = Math.min(Math.round(r * factor), 255);
  let ng = Math.min(Math.round(g * factor), 255);
  let nb = Math.min(Math.round(b * factor), 255);

  const desaturate = 0.4;
  nr = Math.round(nr * (1 - desaturate) + 127 * desaturate);
  ng = Math.round(ng * (1 - desaturate) + 127 * desaturate);
  nb = Math.round(nb * (1 - desaturate) + 127 * desaturate);

  return `rgb(${nr}, ${ng}, ${nb})`;
};

export default function TrackPlayer({ id, locale, initialPresence }: Props) {
  const [track, setTrack] = useState<LanyardSpotify | null>(
    initialPresence?.listening_to_spotify && initialPresence?.spotify
      ? initialPresence.spotify
      : null,
  );
  const [progress, setProgress] = useState<TrackProgress | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [heights, setHeights] = useState<number[]>([12, 12, 12, 12, 12, 12]);
  const [isClient, setIsClient] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const paletteCacheRef = useRef<Map<string, string[]>>(new Map());
  const [isChanging, setIsChanging] = useState(false);
  const [prevAlbumArt, setPrevAlbumArt] = useState<string | null>(null);
  const t = getTranslator(locale);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let lastTimestamp = 0;
    const animateHeights = (timestamp: number) => {
      if (timestamp - lastTimestamp >= 150) {
        setHeights((prevHeights) => {
          const newHeights = new Array(WAVE_COUNT);
          for (let i = 0; i < WAVE_COUNT; i++) {
            const change = (Math.random() - 0.5) * 8;
            let newHeight = prevHeights[i] + change;
            newHeight = Math.min(Math.max(newHeight, 8), 24);
            newHeights[i] = Math.floor(newHeight);
          }
          return newHeights;
        });
        lastTimestamp = timestamp;
      }
      animationRef.current = requestAnimationFrame(animateHeights);
    };

    animationRef.current = requestAnimationFrame(animateHeights);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !track?.album_art_url) return;

    const cachedPalette = paletteCacheRef.current.get(track.album_art_url);
    if (cachedPalette) {
      setPalette(cachedPalette);
      return;
    }

    let isMounted = true;

    const extractColors = async () => {
      try {
        const result = await prominent(track.album_art_url, {
          amount: WAVE_COUNT,
        });
        if (
          isMounted &&
          result &&
          typeof result !== "string" &&
          result.length > 0
        ) {
          const colorStrings = (result as number[][]).map((color: number[]) => {
            const rgbString = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            return normalizeColor(rgbString);
          });
          paletteCacheRef.current.set(track.album_art_url, colorStrings);
          setPalette(colorStrings);
        }
      } catch (error) {
        console.error("Failed to extract palette:", error);
        if (isMounted) setPalette([]);
      }
    };

    extractColors();

    return () => {
      isMounted = false;
    };
  }, [track?.album_art_url, isClient]);

  const handlePresenceUpdate = useCallback((presence: LanyardPresence) => {
    if (presence.listening_to_spotify && presence.spotify) {
      setTrack((prev: LanyardSpotify | null) => {
        if (prev?.track_id === presence.spotify?.track_id) return prev;

        if (prev?.album_art_url) {
          setPrevAlbumArt(prev.album_art_url);
          setIsChanging(true);
          setTimeout(() => setIsChanging(false), 600);
        }

        return presence.spotify as LanyardSpotify;
      });
    } else {
      setTrack(null);
    }
  }, []);

  useEffect(() => {
    if (!isClient || !track?.timestamps) return;

    const updateProgress = () => {
      const now = Date.now();
      const start = track.timestamps.start;
      const end = track.timestamps.end;

      if (start && end) {
        const total = end - start;
        const elapsed = now - start;
        const percentage = Math.min(Math.max((elapsed / total) * 100, 0), 100);

        setProgress({
          start,
          end,
          progress: percentage,
        });
      }
    };

    updateProgress();
    const interval = setInterval(updateProgress, 300);

    return () => clearInterval(interval);
  }, [track, isClient]);

  useEffect(() => {
    if (!isClient) return;

    const connect = () => {
      try {
        const ws = new WebSocket("wss://api.lanyard.rest/socket");
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket connected");
        };

        ws.onmessage = (event) => {
          const data: WebSocketMessage = JSON.parse(event.data);

          if (data.op === 1) {
            const heartbeatIntervalMs = (
              data.d as { heartbeat_interval: number }
            ).heartbeat_interval;
            heartbeatRef.current = setInterval(() => {
              if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ op: 3 }));
              }
            }, heartbeatIntervalMs);

            wsRef.current?.send(
              JSON.stringify({
                op: 2,
                d: { subscribe_to_id: id },
              }),
            );
          }

          if (data.op === 0 && data.t === "PRESENCE_UPDATE") {
            handlePresenceUpdate(data.d as LanyardPresence);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected, reconnecting...");
          setTimeout(connect, 5000);
        };
      } catch (err) {
        console.error("Connection error:", err);
        setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [id, isClient, handlePresenceUpdate]);

  const trackUrl = useMemo(() => {
    return track ? `https://open.spotify.com/track/${track.track_id}` : "";
  }, [track]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const duration =
    track?.timestamps?.start && track?.timestamps?.end
      ? track.timestamps.end - track.timestamps.start
      : 0;
  const currentTime =
    track?.timestamps?.start && progress
      ? Math.min(Math.max(Date.now() - track.timestamps.start, 0), duration)
      : 0;

  if (!track) {
    return null;
  }

  return (
    <section className="relative group flex">
      <span className="w-4 sm:w-6 md:w-12 bg-body shrink-0 border-r md:border-r-0 border-foreground/5 border-b" />
      <span className="relative hidden flex-1 border-x border-foreground/5 md:block border-b" />
      <div className="mx-auto max-w-screen-md relative flex flex-col min-w-0 w-full border-b border-foreground/5">
        <div className="absolute [z-index:9999] size-1.5 rotate-45 border border-foreground/5 bg-body -bottom-[3.5px] -left-[3.5px]" />
        <div className="absolute [z-index:9999] size-1.5 rotate-45 border border-foreground/5 bg-body -bottom-[3.5px] -right-[3.5px]" />
        <a
          href={trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-4 lg:px-8 flex flex-col gap-1.5 overflow-hidden @hover:bg-surface/25 focus-visible:bg-surface/25 active:bg-surface/30! motion-safe:transition outline-none"
        >
          <p className="text-current/75 text-xs flex items-center gap-1.5">
            {t("spotify.listening")}
            <span className="i-logos:spotify-icon grayscale-100"></span>
          </p>

          <div className="flex gap-3 items-center justify-center">
            {track.album_art_url && (
              <div
                className="relative shrink-0"
                style={{ width: 56, height: 56 }}
              >
                {prevAlbumArt && isChanging && (
                  <img
                    src={prevAlbumArt}
                    alt=""
                    width={56}
                    height={56}
                    className="absolute inset-0 rounded-lg object-cover shadow-2xl"
                    style={{
                      animation:
                        "flipOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                    }}
                    draggable={false}
                  />
                )}

                <img
                  src={track.album_art_url}
                  alt={track.album}
                  width={56}
                  height={56}
                  className="rounded-lg shrink-0 shadow-2xl"
                  style={{
                    animation: isChanging
                      ? "flipIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards"
                      : "none",
                  }}
                  draggable={false}
                  loading="eager"
                  onAnimationEnd={() => {
                    if (isChanging) {
                      setPrevAlbumArt(null);
                    }
                  }}
                />
              </div>
            )}
            <div className="min-w-0 grow -mb-1">
              <div className="flex justify-between grow">
                <div className="flex flex-col">
                  <div className="font-serif leading-none font-medium text-sm mb-1.5 truncate">
                    <TextMorph locale={locale}>{track.song}</TextMorph>
                  </div>
                  <div className="text-xs leading-none text-current/75 truncate">
                    <TextMorph locale={locale}>{track.artist}</TextMorph>
                  </div>
                </div>

                <div className="ms-auto relative shrink-0 flex items-center gap-0.5">
                  {heights.map((height, i) => (
                    <div
                      key={i}
                      className="w-0.5 rounded-full transition-all duration-100 ease-out"
                      style={{
                        height: `${height}px`,
                        backgroundColor: palette[i] || "currentColor",
                        opacity: 0.42 + height / 67,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <TextMorph className="text-xs font-mono leading-loose text-current/40 tabular-nums">
                  {formatTime(currentTime)}
                </TextMorph>
                <div className="relative flex-1 w-full h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-foreground/40 transition-all duration-100 ease-linear"
                    style={{ width: `${progress?.progress || 0}%` }}
                  />
                </div>
                <TextMorph className="text-xs font-mono leading-loose text-current/40 tabular-nums">
                  {formatTime(duration)}
                </TextMorph>
              </div>
            </div>
          </div>
        </a>
      </div>
      <span className="relative hidden flex-1 border-x border-foreground/5 md:block border-b" />
      <span className="relative w-4 sm:w-6 md:w-12 bg-body shrink-0 border-l md:border-l-0 border-foreground/5 border-b" />
    </section>
  );
}
