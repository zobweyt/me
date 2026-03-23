import type { SKILL_CATEGORIES, SKILL_GROUPS } from "./constants";

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export type SkillGroup = (typeof SKILL_GROUPS)[number];

export interface Skill {
  id: string;
  name: string;
  icon: string;
  group: SkillGroup;
  categories: SkillCategory[];
}
