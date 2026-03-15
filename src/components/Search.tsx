import type { CollectionEntry } from "astro:content";
import { navigate } from "astro:transitions/client";
import { cx } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import {
  CommandDialog,
  CommandDialogContent,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/Command";
import { SOCIALS, type Social } from "@/constants";
import { LOCALES, type Locale, getTranslator } from "@/i18n";
import { DialogClose, DialogTrigger } from "./Dialog";

const THEME_ICON_CLASS_NAMES: Record<"light" | "dark" | "system", string> = {
  light: "i-lucide:sun",
  dark: "i-lucide:moon",
  system: "i-lucide:monitor",
};

const LOCALES_FLAGS: Record<Locale, string> = {
  en: "https://emojicdn.elk.sh/🇺🇸?style=apple",
  ru: "https://emojicdn.elk.sh/🇷🇺?style=apple",
};

const SOCIALS_ICONS: Record<
  Social["id"],
  React.ComponentType<React.ComponentProps<"span">>
> = {
  telegram: ({ className, ...props }: React.ComponentProps<"span">) => (
    <span className={cx("i-logos:telegram text-2xl", className)} {...props} />
  ),
  github: ({ className, ...props }: React.ComponentProps<"span">) => (
    <span
      className={cx("i-logos:github-icon text-2xl dark:invert", className)}
      {...props}
    />
  ),
  mail: ({ className, ...props }: React.ComponentProps<"span">) => (
    <span
      className={cx("i-lucide:mail text-2xl opacity-50", className)}
      {...props}
    />
  ),
};

export default function Search({
  posts,
  projects,
  className,
  url,
  site,
  currentLocale,
  ...props
}: {
  posts: CollectionEntry<"blog">[];
  projects: CollectionEntry<"projects">[];
  url: URL;
  site: URL | undefined;
  currentLocale: string | undefined;
} & React.ComponentProps<typeof DialogTrigger>) {
  const t = getTranslator(currentLocale);
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
            <span className="i-lucide:arrow-right shrink-0 text-2xl opacity-50" />
          ),
          name: t("search.groups.pages.items.home"),
          href: `/${currentLocale}`,
        },
        {
          icon: (
            <span className="i-lucide:arrow-right shrink-0 text-2xl opacity-50" />
          ),
          name: t("search.groups.pages.items.blog"),
          href: `/${currentLocale}/blog`,
        },
        {
          icon: (
            <span className="i-lucide:arrow-right shrink-0 text-2xl opacity-50" />
          ),
          name: t("search.groups.pages.items.projects"),
          href: `/${currentLocale}/projects`,
        },
      ],
    },
    {
      name: t("search.groups.blog.title"),
      items: posts.map((post) => ({
        icon: (
          <span className="i-lucide:sticky-note shrink-0 text-2xl opacity-50" />
        ),
        name: post.data.title,
        keywords: [
          ...(post.data.tags ?? []),
          ...post.data.description.replace(".", "").split(" "),
        ],
        href: `/${currentLocale}/blog/${post.id.split("/")[1]}`,
      })),
    },
    {
      name: t("search.groups.projects.title"),
      items: projects.map((project) => ({
        icon: (
          <img
            src={project.data.logo}
            alt={project.data.title}
            className={cx(
              "size-6 shrink-0",
              project.data.logoShape === "circle" && "rounded-full",
            )}
          />
        ),
        name: project.data.title,
        href: project.data.href ?? project.data.repo ?? "#",
        external: true,
      })),
    },
    {
      name: t("search.groups.socials.title"),
      items: [
        {
          name: "RSS",
          icon: (
            <span className="i-streamline-logos:rss-feed-logo-block shrink-0 text-2xl !text-[#FF6600]" />
          ),
          href: `${site}${currentLocale}/rss.xml`,
          external: true,
        },
        ...SOCIALS.map((social) => {
          const Icon = SOCIALS_ICONS[social.id];

          return {
            icon: <Icon className="size-6 shrink-0" />,
            name: social.name,
            href: social.href,
            external: true,
          };
        }),
      ],
    },
    {
      name: t("search.groups.themes.title"),
      items: [
        ...(["light", "dark", "system"] as const).map((theme) => {
          const iconClassName = THEME_ICON_CLASS_NAMES[theme];

          return {
            icon: (
              <span
                className={cx(
                  "size-6 shrink-0 text-2xl opacity-50",
                  iconClassName,
                )}
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
          };
        }),
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
          href:
            currentLocale != null
              ? url.pathname.replace(currentLocale, locale)
              : `/${locale}`,
          action: true,
          keywords: [locale],
        })),
      ],
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cx(
          "flex w-fit cursor-pointer items-center justify-center gap-1 rounded-full border border-foreground/15 bg-body-alt/50 px-2.5 py-1.5 text-sm leading-none transition outline-none hover:bg-body-alt focus-visible:bg-body-alt",
          className,
        )}
        title={`${t("search.title")} (Ctrl+K)`}
        {...props}
      >
        <span className="i-lucide:search text-sm text-foreground/75 opacity-75 md:-ml-0.5" />
        <span>{t("search.title")}</span>
      </DialogTrigger>
      <CommandDialogContent
        title={t("search.title")}
        description={t("search.description")}
        onCloseAutoFocus={() => {
          setQuery("");
        }}
      >
        <div className="flex items-center justify-center border-b border-foreground/15 px-3 py-2">
          <CommandInput
            value={query}
            ref={inputRef}
            onInput={(e) => setQuery(e.currentTarget.value)}
            placeholder={t("search.input.placeholder")}
            className={cx("ps-10", query && "pe-10")}
            before={
              <span className="i-lucide:search absolute left-2.5 shrink-0 text-xl opacity-50" />
            }
            after={
              query && (
                <button
                  type="button"
                  className="absolute right-0 flex size-9 cursor-pointer items-center justify-center opacity-50 hover:opacity-75 focus-visible:opacity-75 active:opacity-100"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                >
                  <span className="i-lucide:x stroke-current text-xl" />
                </button>
              )
            }
          />

          <DialogClose className="flex cursor-pointer items-center px-3 py-1.5 no-underline opacity-75 transition-opacity hover:opacity-100 sm:hidden">
            {t("search.footer.exit")}
          </DialogClose>
        </div>

        <CommandList>
          <CommandEmpty>{t("search.empty")}</CommandEmpty>

          {groups.map((group) => (
            <CommandGroup key={group.name} heading={group.name}>
              {group.items.map((item, index) => (
                <CommandItem
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
                  <Highlighter
                    autoEscape
                    searchWords={[query]}
                    textToHighlight={item.name}
                    highlightClassName="bg-yellow-400 rounded-sm"
                  />
                  {item.action !== true && (
                    <Highlighter
                      autoEscape
                      searchWords={[query]}
                      textToHighlight={item.href
                        .replace(`/${currentLocale}`, "")
                        .replace("https://", "")
                        .replace(/\/+$/, "")}
                      className="min-w-0 truncate text-current/50"
                      highlightClassName="bg-yellow-400 rounded-sm"
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>

        <div className="flex gap-4 border-t border-foreground/15 px-5 py-2 text-sm text-current/75 select-none max-sm:hidden">
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
      </CommandDialogContent>
    </CommandDialog>
  );
}
