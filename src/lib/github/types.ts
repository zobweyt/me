export type GitHubRepo = {
  owner: string;
  name: string;
};

export type GitHubRepoStats = {
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  };
};
