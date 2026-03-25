import { getCollection } from "astro:content";
import ids from "@/content/skills/ids";

export const getSkills = async () => {
  const skills = await getCollection("skills");

  return skills.sort((a, b) => {
    const getOrder = (id: string) => {
      const index = ids.indexOf(id as (typeof ids)[number]);
      return index === -1 ? Infinity : index;
    };
    return getOrder(a.id) - getOrder(b.id);
  });
};
