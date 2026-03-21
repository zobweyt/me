import { fetchGitHubGraphQL } from "../fetch";
import type { GitHubRepo, GitHubRepoStats } from "../types";

const DEFAULT_STATS: GitHubRepoStats = {
  stargazerCount: 0,
  forkCount: 0,
  primaryLanguage: {
    name: "Unknown",
    color: "#858585",
  },
};

export const fetchGitHubStats = async (
  repos: GitHubRepo[],
): Promise<GitHubRepoStats[]> => {
  const aliases = repos
    .map(
      (repo, i) => `
    repo${i}: repository(owner: "${repo.owner}", name: "${repo.name}") {
      stargazerCount
      forkCount
      primaryLanguage {
        name
        color
      }
    }
  `,
    )
    .join("\n");

  const query = `query { ${aliases} }`;
  const stats = await fetchGitHubGraphQL(query);

  if (!stats) {
    return repos.map(() => DEFAULT_STATS);
  }

  return repos.map((_, index) => stats[`repo${index}`] || DEFAULT_STATS);
};
