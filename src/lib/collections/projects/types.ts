import type { CollectionEntry } from "astro:content";
import type { GitHubRepoStats } from "@/lib/github";

export type Project = CollectionEntry<"projects">;

export type ProjectWithLocalization = Omit<Project, "data"> & {
  data: Omit<Project["data"], "i18n"> & {
    title: string;
    description: string;
    href?: string;
  };
};

export type ProjectWithStats = ProjectWithLocalization & {
  stats?: GitHubRepoStats;
};
