import { getCollection } from "astro:content";
import { type GitHubRepo, fetchGitHubStats } from "@/lib/github";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import type { ProjectWithLocalization, ProjectWithStats } from "../projects";

export type GetProjectsProps = {
  count?: number;
  locale?: string;
};

export const getProjects = async ({
  count,
  locale,
}: GetProjectsProps = {}): Promise<ProjectWithLocalization[]> => {
  const projects = await getCollection("projects");

  const entries = projects
    .sort((a, b) => b.data.dateStart.valueOf() - a.data.dateStart.valueOf())
    .map((project) => {
      const { i18n, ...commonData } = project.data;

      const localeData = i18n[locale as keyof typeof i18n];
      const defaultData = i18n[DEFAULT_LOCALE];

      return {
        ...project,
        data: {
          ...commonData,
          title: localeData?.title ?? defaultData?.title ?? commonData.id,
          description:
            localeData?.description ?? defaultData?.description ?? "",
          href: localeData?.href ?? defaultData?.href,
        },
      };
    });

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
