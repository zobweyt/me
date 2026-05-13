import { LAST_FM_API_KEY } from "astro:env/server";
import sharp from "sharp";

interface LastFmRecentTracksResponse {
  recenttracks: {
    track: Array<{
      name: string;
      artist: { "#text": string };
      album: { "#text": string };
      image: Array<{ "#text": string; size: string }>;
      url: string;
      "@attr"?: { nowplaying: string };
    }>;
  };
}

export type Track = Awaited<ReturnType<typeof getCurrentTrack>>;

async function getDominantColorFromUrl(
  imageUrl: string,
): Promise<string | null> {
  if (!imageUrl) return null;

  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    const { dominant } = await sharp(Buffer.from(buffer)).stats();

    const { r, g, b } = dominant;

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch (error) {
    console.error("Color extraction error:", error);
    return null;
  }
}

export async function getCurrentTrack() {
  try {
    const url = new URL("http://ws.audioscrobbler.com/2.0/");
    url.searchParams.append("method", "user.getrecenttracks");
    url.searchParams.append("user", "zobweyt");
    url.searchParams.append("api_key", LAST_FM_API_KEY);
    url.searchParams.append("format", "json");
    url.searchParams.append("limit", "1");

    const response = await fetch(url.toString());

    if (!response.ok) {
      return { error: `Last.fm API error: ${response.status}` };
    }

    const data: LastFmRecentTracksResponse = await response.json();

    if (!data.recenttracks?.track?.length) {
      return { isPlaying: false };
    }

    const track = data.recenttracks.track[0];

    const isNowPlaying = track["@attr"]?.nowplaying === "true";

    if (!isNowPlaying) {
      return { isPlaying: false };
    }

    const albumCover = track.image[track.image.length - 1]?.["#text"];
    const dominantColor = albumCover
      ? await getDominantColorFromUrl(albumCover)
      : null;

    return {
      isPlaying: true,
      title: track.name,
      artist: track.artist["#text"],
      album: track.album["#text"],
      albumCover: albumCover,
      songUrl: track.url,
      dominantColor,
    };
  } catch (error) {
    console.error("Last.fm fetch error:", error);
    return { error };
  }
}
