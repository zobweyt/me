import { navigate } from "astro:transitions/client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Command } from "@/components/ui";
import type { GitHubRepoStats } from "@/lib/github";
import { LOCALES, type Locale, getTranslator } from "@/lib/i18n";

const THEME_ICON_CLASS_NAMES: Record<"light" | "dark" | "system", string> = {
  light: "i-f7:sun-max",
  dark: "i-f7:moon-stars",
  system: "i-f7:device-laptop",
};

const LOCALES_FLAGS: Record<Locale, string> = {
  en: "https://emojicdn.elk.sh/🇺🇸?style=apple",
  ru: "https://emojicdn.elk.sh/🇷🇺?style=apple",
};

export default function Search({
  posts,
  projects,
  socials,
  url,
  site,
  locale,
  ...props
}: {
  posts: {
    id: string;
    title: string;
    description: string;
    tags: string[] | undefined;
    date: Date;
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    logo: string;
    href: string | undefined;
    repo: string | undefined;
    stats: GitHubRepoStats | undefined;
  }[];
  socials: {
    id: string;
    name: string;
    href: string;
    icon: string;
  }[];
  url: URL;
  site: URL | undefined;
  locale: string | undefined;
} & React.ComponentProps<typeof Command.Trigger>) {
  const t = getTranslator(locale);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.code === "KeyK" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const groups: {
    name: string;
    items: {
      icon: React.ReactNode;
      name: string;
      href: string;
      extra?: React.ReactNode;
      onClick?: VoidFunction;
      keywords?: string[];
      action?: boolean;
      external?: boolean;
    }[];
  }[] = [
    {
      name: t("search.groups.pages.title"),
      items: [
        {
          icon: (
            <span className="i-f7:house shrink-0 text-2xl text-current/50" />
          ),
          name: t("search.groups.pages.items.home"),
          href: `/${locale}`,
        },
        {
          icon: (
            <span className="i-f7:tray-full shrink-0 text-2xl text-current/50" />
          ),
          name: t("search.groups.pages.items.blog"),
          href: `/${locale}/blog`,
        },
        {
          icon: (
            <span className="i-f7:briefcase shrink-0 text-2xl text-current/50" />
          ),
          name: t("search.groups.pages.items.projects"),
          href: `/${locale}/projects`,
        },
        {
          icon: (
            <span className="size-6 shrink-0 text-xl i-f7:doc-text opacity-50" />
          ),
          name: t("resume"),
          href: "https://zobweyt.github.io/resume",
          extra: (
            <span className="text-current/50">zobweyt.github.io/resume</span>
          ),
          external: true,
        },
      ],
    },
    {
      name: t("search.groups.blog.title"),
      items: posts.map((post) => ({
        icon: (
          <span className="i-f7:doc-richtext shrink-0 text-2xl opacity-50" />
        ),
        name: post.title,
        keywords: [
          ...(post.tags ?? []),
          ...post.description.replace(".", "").split(" "),
        ],
        href: `/${locale}/blog/${post.id.split("/")[1]}`,
        extra: (
          <span className="text-current/50">
            {post.date.toLocaleDateString(locale, {
              day: "numeric",
              month: "short",
            })}
          </span>
        ),
      })),
    },
    {
      name: t("search.groups.projects.title"),
      items: projects.map((project) => ({
        icon: (
          <img
            src={project.logo}
            alt={project.title}
            className="size-6 shrink-0 rounded-full"
          />
        ),
        name: project.title,
        href: project.href ?? project.repo ?? "#",
        extra: project.stats && (
          <div className="text-current/50">
            <p className="flex items-center gap-1">
              <span className="i-lucide:star text-base" />
              <span className="tabular-nums leading-none">
                {project.stats.stargazerCount}
              </span>
            </p>
          </div>
        ),
        external: true,
      })),
    },
    {
      name: t("search.groups.socials.title"),
      items: socials.map((social) => ({
        icon: (
          <span
            className={["size-6 shrink-0 text-xl", social.icon].join(" ")}
          />
        ),
        name: social.name,
        href: social.href,
        extra: (
          <span className="text-current/50">
            {social.href.replace("https://", "")}
          </span>
        ),
        external: true,
      })),
    },
    {
      name: t("search.groups.themes.title"),
      items: [
        ...(["light", "dark", "system"] as const).map((theme) => ({
          icon: (
            <span
              className={[
                "size-6 shrink-0 text-2xl opacity-50",
                THEME_ICON_CLASS_NAMES[theme],
              ].join(" ")}
            />
          ),
          name: t(`search.groups.themes.items.${theme}`),
          href: "",
          action: true,
          onClick: () => {
            document.dispatchEvent(
              new CustomEvent("set-theme", {
                detail: theme === "system" ? null : theme,
              }),
            );
          },
          keywords: [theme],
        })),
      ],
    },
    {
      name: t("search.groups.locales.title"),
      items: [
        ...LOCALES.map((locale) => ({
          icon: (
            <img
              src={LOCALES_FLAGS[locale]}
              alt={locale}
              width={24}
              height={24}
            />
          ),
          name: t(`search.groups.locales.items.${locale}`),
          href: url.pathname.replace(/^\/[^/]+/, `/${locale}`),
          action: true,
          keywords: [locale],
        })),
      ],
    },
  ];

  return (
    <Command.Root
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setQuery("");
        }
      }}
    >
      <Command.Trigger
        render={<Button />}
        title={`${t("search.title")} (Ctrl+K)`}
        {...props}
      >
        <span className="i-f7:search text-foreground/75 text-base -m-0.5" />
        {t("search.title")}
      </Command.Trigger>
      <Command.Popup
        title={t("search.title")}
        description={t("search.description")}
        initialFocus={inputRef}
      >
        <div className="flex z-10 max-sm:fixed max-sm:inset-x-0 items-center justify-center pt-3 px-3 sm:py-2 sm:border-b sm:border-foreground/5">
          <Command.Input
            value={query}
            ref={inputRef}
            autoFocus
            onInput={(e) => setQuery(e.currentTarget.value)}
            placeholder={t("search.input.placeholder")}
            className={["ps-10", query ? "pe-10" : ""].join(" ")}
            before={
              <span className="i-f7:search absolute left-2 shrink-0 text-2xl text-current/50" />
            }
            after={
              query && (
                <button
                  type="button"
                  className="absolute right-0 flex size-9 cursor-pointer items-center justify-center text-current/50 @hover:text-current/75 focus-visible:text-current/75 active:!text-current motion-safe:(transition duration-300 ease-in-out)"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                >
                  <span className="i-f7:xmark-circle-fill stroke-current text-xl" />
                </button>
              )
            }
          />

          <Button
            render={<Command.Close />}
            className="ms-2.5 sm:hidden p-0! size-10 aspect-square"
            aria-label={t("search.footer.exit")}
          >
            <span className="i-f7:xmark text-2xl text-current/75" />
          </Button>
        </div>

        <Command.List className="max-sm:mt-6">
          <Command.Empty className="flex-col items-center justify-center">
            <span className="i-f7:search text-5xl text-current/50 mb-1.5" />
            <span className="text-xl font-medium mb-0.5">
              {t("search.empty.title").replace("{query}", query)}
            </span>
            <span className="text-sm text-current/50">
              {t("search.empty.description")}
            </span>
          </Command.Empty>

          {groups.map((group) => (
            <Command.Group key={group.name} heading={group.name}>
              {group.items.map((item, index) => (
                <Command.Item
                  key={`${item.href}-${index}`}
                  onSelect={() => {
                    setOpen(false);

                    if (!item.href) {
                      item.onClick?.();
                      return;
                    }

                    if (item.external === true) {
                      window.open(item.href, "_blank")?.focus();
                    } else {
                      navigate(item.href);
                    }
                  }}
                  keywords={item.keywords}
                >
                  {item.icon}
                  <span className="min-w-0 truncate">{item.name}</span>
                  {item.extra}
                  {/* {item.external && (
                    <span className="min-w-0 truncate text-current/50">
                      {item.href
                        .replace(new RegExp(`^/${locale}`), "")
                        .replace("https://", "")
                        .replace(/\/+$/, "")}
                    </span>
                  )} */}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>

        <div className="flex gap-4 border-t border-foreground/5 px-5 py-2 text-sm text-current/75 select-none max-sm:hidden">
          <div className="flex items-center gap-2">
            <kbd className="flex min-w-6 justify-center rounded-sm bg-foreground/5 px-1 py-0.5 text-center font-mono text-xs leading-3.5 ring ring-foreground/15">
              ↩
            </kbd>
            <span>{t("search.footer.select")}</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="flex min-w-6 justify-center rounded-sm bg-foreground/5 px-1 py-0.5 text-center font-mono text-xs leading-3.5 ring ring-foreground/15">
              ↑
            </kbd>
            <span>{t("search.footer.previous")}</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="flex min-w-6 justify-center rounded-sm bg-foreground/5 px-1 py-0.5 text-center font-mono text-xs leading-3.5 ring ring-foreground/15">
              ↓
            </kbd>
            <span>{t("search.footer.next")}</span>
          </div>
          <div className="ms-auto flex items-center gap-2">
            <kbd className="flex min-w-6 justify-center rounded-sm bg-foreground/5 px-1 py-0.5 text-center font-mono text-xs leading-3.5 ring ring-foreground/15">
              esc
            </kbd>
            <span>{t("search.footer.exit")}</span>
          </div>
        </div>
      </Command.Popup>
    </Command.Root>
  );
}
