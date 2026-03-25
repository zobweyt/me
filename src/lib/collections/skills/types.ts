import type { CollectionEntry } from "astro:content";
import type SKILL_CATEGORIES from "@/content/skills/categories";
import type SKILL_GROUPS from "@/content/skills/groups";

export type Skill = CollectionEntry<"skills">;

export type SkillGroup = (typeof SKILL_GROUPS)[number];

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
