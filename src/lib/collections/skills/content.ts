import { getCollection } from "astro:content";
import SKILLS_DATA from "@/content/skills/data.json";

export const getSkills = async () => {
  const skills = await getCollection("skills");
  const order = Object.fromEntries(
    SKILLS_DATA.map((skill, i) => [skill.id, i]),
  );

  return skills.sort(
    (a, b) => (order[a.id] ?? Infinity) - (order[b.id] ?? Infinity),
  );
};
