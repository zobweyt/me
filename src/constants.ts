export const RECENT_BLOG_ENTRIES_COUNT = 3;
export const RECENT_PROJECTS_ENTRIES_COUNT = 2;

export type Social = {
  id: string;
  name: string;
  href: string;
  color?: string;
};

export const SOCIALS: Social[] = [
  {
    id: "telegram",
    name: "Telegram",
    href: "https://t.me/zobweyt",
    color: "#0088CC",
  },
  {
    id: "github",
    name: "GitHub",
    href: "https://github.com/zobweyt",
    color: "light-dark(#181717,#FFF)",
  },
  {
    id: "mail",
    name: "zobweyt@gmail.com",
    href: "mailto:zobweyt@gmail.com",
    color: "#D93025",
  },
] as const;
