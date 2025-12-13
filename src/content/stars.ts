import type { InferEntrySchema } from "astro:content";
import { GITHUB_TOKEN } from "astro:env/server";

const cache: Map<string, { stars: number; timestamp: number }> = new Map();
const CACHE_DURATION = 60 * 60 * 1000;

export const getProjectStars = async (project: InferEntrySchema<"projects">): Promise<number | null> => {
  if (project.repo === undefined) {
    return null;
  }

  const now = Date.now();
  const cached = cache.get(project.repo);

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.stars;
  }

  try {
    const response = await fetch(project.repo.replace("github.com", "api.github.com/repos"), {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    const { stargazers_count: stars = 0, message } = await response.json();

    if (!response.ok) {
      console.warn(message);
      return null;
    }

    cache.set(project.repo, { stars, timestamp: now });

    return stars;
  } catch (error) {
    console.error(error);
    return null;
  }
};
