import { type CollectionEntry, getCollection } from "astro:content";
import {
  type GitHubRepo,
  type GitHubRepoStats,
  fetchGitHubStats,
} from "../github";

export type Project = CollectionEntry<"projects">;

export type ProjectWithStats = Project & {
  stats?: GitHubRepoStats;
};

export type GetProjectsProps = {
  count?: number;
  locale?: string;
};

export const getProjects = async ({ count, locale }: GetProjectsProps = {}) => {
  const projects = await getCollection("projects");

  const entries = projects
    .filter((p) => !locale || p.id.startsWith(`${locale}/`))
    .sort((a, b) => b.data.dateStart.valueOf() - a.data.dateStart.valueOf());

  return count ? entries.slice(0, count) : entries;
};

export const getProjectsWithRepos = async (props?: GetProjectsProps) => {
  const projects = await getProjects(props);
  return projects.filter(
    (p): p is typeof p & { data: { repo: string } } => !!p.data.repo,
  );
};

export const getProjectsWithStats = async (
  props?: GetProjectsProps,
): Promise<ProjectWithStats[]> => {
  const projects = await getProjectsWithRepos(props);

  const repos = projects
    .map((p) => {
      const match = p.data.repo.match(/github\.com\/([^/]+)\/([^/]+)/);
      return match ? { owner: match[1], name: match[2] } : null;
    })
    .filter((repo): repo is GitHubRepo => repo !== null);

  if (!repos.length) {
    return projects;
  }

  try {
    const stats = await fetchGitHubStats(repos);
    return projects.map((project, index) => ({
      ...project,
      stats: stats ? stats[index] : undefined,
    }));
  } catch (error) {
    console.error("GitHub API error:", error);
    return projects;
  }
};

export const getProjectsWithStatsByYears = async (props?: GetProjectsProps) => {
  const data = await getProjectsWithStats(props);

  type Acc = {
    [year: string]: ProjectWithStats[];
  };

  const projects = data.reduce((acc: Acc, project) => {
    const year = project.data.dateStart.getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(project);
    return acc;
  }, {});

  const years = Object.keys(projects).sort(
    (a, b) => parseInt(b, 10) - parseInt(a, 10),
  );

  return { projects, years };
};
