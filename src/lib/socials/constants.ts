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
