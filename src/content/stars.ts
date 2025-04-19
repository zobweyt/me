import type { InferEntrySchema } from "astro:content";

export const getProjectStars = async (project: InferEntrySchema<"projects">): Promise<number | null> => {
  if (project.repo === undefined) {
    return null;
  }

  try {
    const response = await fetch(project.repo.replace("github.com", "api.github.com/repos"), {
      headers: {
        Authorization: `token ${import.meta.env.GITHUB_TOKEN}`,
      },
    });

    const { stargazers_count: stars = 0, message } = await response.json();

    if (!response.ok) {
      console.warn(message);
      return null;
    }

    return stars;
  } catch (error) {
    console.error(error);
    return null;
  }
};
