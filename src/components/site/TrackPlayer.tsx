import { useEffect, useState } from "react";
import type { Track } from "@/lib/last-fm";

export default function TrackPlayer({ initialData }: { initialData: Track }) {
  const [track, setTrack] = useState<Track>(initialData);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const response = await fetch("/api/music.json");
        const data = await response.json();
        setTrack(data);
      } catch (error) {
        console.error("Failed to fetch track:", error);
      }
    };
    const interval = setInterval(fetchTrack, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!track.isPlaying) {
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
          href={track.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-4 flex gap-2 items-center lg:px-8 overflow-hidden @hover:bg-surface/25 focus-visible:bg-surface/25 active:bg-surface/30! motion-safe:transition outline-none"
        >
          {track.albumCover && (
            <img
              src={track.albumCover}
              alt={track.album}
              width={36}
              height={36}
              style={
                {
                  boxShadow: `0 0 14px 2px ${track.dominantColor}25`,
                } as React.CSSProperties
              }
              className="rounded-md"
              draggable={false}
            />
          )}
          <div>
            <div className="font-serif font-medium text-sm">{track.title}</div>
            <div className="text-xs font-mono text-current/50">
              {track.artist}
            </div>
          </div>
          <div className="ms-auto relative">
            <SoundWaveIcon />
          </div>
        </a>
      </div>
      <span className="relative hidden flex-1 border-x border-foreground/5 md:block border-b" />
      <span className="relative w-4 sm:w-6 md:w-12 bg-body shrink-0 border-l md:border-l-0 border-foreground/5 border-b" />
    </section>
  );
}

function SoundWaveIcon() {
  const [heights, setHeights] = useState<number[]>([12, 12, 12, 12, 12, 12]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: 6 }, () => Math.floor(Math.random() * 16) + 8),
      );
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-0.5">
      {heights.map((height, i) => (
        <div
          key={i}
          className="w-0.5 rounded-full transition-all duration-150 ease-out"
          style={{
            height: `${height}px`,
            backgroundColor: "currentColor",
            opacity: 0.1 + height / 67,
          }}
        />
      ))}
    </div>
  );
}
