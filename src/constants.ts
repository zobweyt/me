import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  name: "Nikita Gaziev",
};

export const RECENT_BLOG_ENTRIES_COUNT = 3;
export const RECENT_PROJECTS_ENTRIES_COUNT = 1;

export const HOME: Metadata = {
  title: "Hey There! 👋",
  description:
    "'sup? I'm zobweyt! I'm engaged into software engineering, optimization, design, moderation, and building thriving online communities. In my free time, I work on various projects, many of which involve discord.",
};

export const BLOG: Metadata = {
  title: "Blog",
  description: "A collection of articles on topics I am passionate about.",
};

export const PROJECTS: Metadata = {
  title: "Projects",
  description: "A collection of my projects with their demos.",
};

export const SOCIALS: Socials = [
  {
    name: "telegram",
    href: "https://t.me/zobweyt",
  },
  {
    name: "github",
    href: "https://github.com/zobweyt",
  },
  {
    name: "zobweyt@gmail.com",
    href: "mailto:zobweyt@gmail.com",
  },
];
