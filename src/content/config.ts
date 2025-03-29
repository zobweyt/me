import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.coerce.date().optional(),
    href: z.string().optional(),
    logo: z.string(),
    color: z.string(),
  }),
});

export const collections = { blog, projects };
