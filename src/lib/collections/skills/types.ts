import type { CollectionEntry } from "astro:content";
import type { SKILL_CATEGORIES, SKILL_GROUPS } from "./constants";

export type Skill = CollectionEntry<"skills">;

export type SkillGroup = (typeof SKILL_GROUPS)[number];

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
