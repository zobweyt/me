import { getCollection } from "astro:content";

export const getSkills = async () => {
  return await getCollection("skills");
};
