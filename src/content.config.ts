import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { LOCALES } from "./lib/i18n";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  loader: file("./src/content/projects/data.json"),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      logo: image(),
      repo: z.string().optional(),
      color: z.string(),
      dateStart: z.coerce.date(),
      dateEnd: z.coerce.date().optional(),
      i18n: z.partialRecord(
        z.enum(LOCALES),
        z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          href: z.string().optional(),
        }),
      ),
    }),
});

const skills = defineCollection({
  loader: file("./src/content/skills/data.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    href: z.string(),
    icon: z.string(),
    group: z.string(),
    categories: z.array(z.string()),
  }),
});

const socials = defineCollection({
  loader: file("./src/content/socials/data.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    href: z.string(),
    icon: z.string(),
  }),
});

const achievements = defineCollection({
  loader: file("./src/content/achievements/data.json"),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      color: z.enum(["gold", "silver", "bronze"]),
      image: image(),
      i18n: z.partialRecord(
        z.enum(LOCALES),
        z.object({
          title: z.string().optional(),
          description: z.string().optional(),
        }),
      ),
    }),
});

export const collections = { blog, projects, skills, socials, achievements };
