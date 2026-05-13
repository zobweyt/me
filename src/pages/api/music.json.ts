import type { APIRoute } from "astro";
import { getCurrentTrack } from "@/lib/last-fm";

export const GET: APIRoute = async () => {
  const track = await getCurrentTrack();
  return new Response(JSON.stringify(track), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
