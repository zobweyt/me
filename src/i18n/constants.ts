export const LOCALES = ["en", "ru"] as const;
export const SITEMAP_LOCALES = Object.fromEntries(LOCALES.map((_, i) => [LOCALES[i], LOCALES[i]]));
export const DEFAULT_LOCALE: Locale = "en" as const;

export type Locale = (typeof LOCALES)[number];

export const ui = {
  en: {
    name: "Nikita Gaziev",
    minread: "min read",
    "home.title": "Hey There! 👋",
    "home.description":
      "'sup? I'm zobweyt! I'm engaged into software engineering, optimization, design, moderation, and building thriving online communities. In my free time, I work on various projects, many of which involve discord.",
    "blog.all": "See all posts",
    "blog.latest": "Latest posts",
    "blog.title": "Blog",
    "blog.description": "A collection of articles on topics I am passionate about.",
    "projects.all": "See all projects",
    "projects.recent": "Recent projects",
    "projects.title": "Projects",
    "projects.description": "A collection of my projects with their demos.",
  },
  ru: {
    name: "Никита Газиев",
    minread: "мин чтения",
    "home.title": "Всем привет! 👋",
    "home.description":
      "'Привет! Я zobweyt! Я занимаюсь программной инженерией, оптимизацией, дизайном, модерацией и созданием процветающих онлайн-сообществ. В свободное время я работаю над различными проектами, многие из которых связаны с Discord.",
    "blog.all": "Все посты",
    "blog.latest": "Последние посты",
    "blog.title": "Блог",
    "blog.description": "Сборник статей на темы, которые меня интересуют.",
    "projects.all": "Все проекты",
    "projects.recent": "Недавние проекты",
    "projects.title": "Проекты",
    "projects.description": "Сборник моих проектов с их демонстрациями.",
  },
} as const satisfies Record<Locale, Record<string, string>>;
