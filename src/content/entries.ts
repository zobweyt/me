import { getCollection } from "astro:content";

export const getBlogEntries = async (props?: { count?: number | undefined; locale?: string | undefined }) => {
  const blog = await getCollection("blog");

  const entries = (props?.locale != null ? blog.filter((entry) => entry.id.split("/")[0] === props.locale) : blog).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return props?.count !== undefined ? entries.slice(0, props.count) : entries;
};

export const getProjectsEntries = async (props?: { count?: number | undefined; locale?: string | undefined }) => {
  const projects = await getCollection("projects");

  const entries = (
    props?.locale != null ? projects.filter((entry) => entry.id.split("/")[0] === props.locale) : projects
  ).sort((a, b) => b.data.dateStart.valueOf() - a.data.dateStart.valueOf());

  return props?.count !== undefined ? entries.slice(0, props.count) : entries;
};
