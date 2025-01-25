import { getCollection } from "astro:content";

export const getBlogEntries = async (count?: number) => {
  const blog = await getCollection("blog");

  const entries = blog.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return count !== undefined ? entries.slice(0, count) : entries;
};

export const getProjectsEntries = async (count?: number) => {
  const projects = await getCollection("projects");

  const entries = projects.sort((a, b) => b.data.dateStart.valueOf() - a.data.dateStart.valueOf());

  return count !== undefined ? entries.slice(0, count) : entries;
};
