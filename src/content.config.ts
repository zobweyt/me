import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

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
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      dateStart: z.coerce.date(),
      dateEnd: z.coerce.date().optional(),
      href: z.string().optional(),
      repo: z.string().optional(),
      logo: image(),
      logoShape: z.enum(["square", "circle"]).default("square"),
      color: z.string(),
    }),
});

export const collections = { blog, projects };
