export const RECENT_BLOG_ENTRIES_COUNT = 3;
export const RECENT_PROJECTS_ENTRIES_COUNT = 2;

export type Social = {
  id: string;
  name: string;
  href: string;
};

export const SOCIALS: Social[] = [
  {
    id: "telegram",
    name: "Telegram",
    href: "https://t.me/zobweyt",
  },
  {
    id: "github",
    name: "GitHub",
    href: "https://github.com/zobweyt",
  },
] as const;
