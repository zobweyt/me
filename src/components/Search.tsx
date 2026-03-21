import { navigate } from "astro:transitions/client";
import { cx } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import * as Command from "@/components/ui/Command";
import { LOCALES, type Locale, getTranslator } from "@/lib/i18n";
import { SOCIALS, type Social } from "@/lib/socials";

const SOCIAL_ICON_CLASS_NAMES: Record<Social["id"], string> = {
  telegram: "i-logos:telegram text-2xl",
  github: "i-logos:github-icon text-2xl dark:invert",
};

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
  className,
  url,
  site,
  currentLocale,
  ...props
}: {
  posts: {
    id: string;
    title: string;
    description: string;
    tags: string[] | undefined;
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    logo: string;
    href: string | undefined;
    repo: string | undefined;
    logoShape: "square" | "circle";
  }[];
  url: URL;
  site: URL | undefined;
  currentLocale: string | undefined;
} & React.ComponentProps<typeof Command.Trigger>) {
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
            <span className="i-f7:house shrink-0 text-2xl text-current/50" />
          ),
          name: t("search.groups.pages.items.home"),
          href: `/${currentLocale}`,
        },
        {
          icon: (
            <span className="i-f7:tray-full shrink-0 text-2xl text-current/50" />
          ),
          name: t("search.groups.pages.items.blog"),
          href: `/${currentLocale}/blog`,
        },
        {
          icon: (
            <span className="i-f7:briefcase shrink-0 text-2xl text-current/50" />
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
          <span className="i-f7:doc-richtext shrink-0 text-2xl opacity-50" />
        ),
        name: post.title,
        keywords: [
          ...(post.tags ?? []),
          ...post.description.replace(".", "").split(" "),
        ],
        href: `/${currentLocale}/blog/${post.id.split("/")[1]}`,
      })),
    },
    {
      name: t("search.groups.projects.title"),
      items: projects.map((project) => ({
        icon: (
          <img
            src={project.logo}
            alt={project.title}
            className={cx(
              "size-6 shrink-0",
              project.logoShape === "circle" && "rounded-full",
            )}
          />
        ),
        name: project.title,
        href: project.href ?? project.repo ?? "#",
        external: true,
      })),
    },
    {
      name: t("search.groups.socials.title"),
      items: SOCIALS.map((social) => ({
        icon: (
          <span
            className={cx(
              "size-6 shrink-0",
              SOCIAL_ICON_CLASS_NAMES[social.id],
            )}
          />
        ),
        name: social.name,
        href: social.href,
        external: true,
      })),
    },
    {
      name: t("search.groups.themes.title"),
      items: [
        ...(["light", "dark", "system"] as const).map((theme) => ({
          icon: (
            <span
              className={cx(
                "size-6 shrink-0 text-2xl opacity-50",
                THEME_ICON_CLASS_NAMES[theme],
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
        className={cx(
          "flex w-fit cursor-pointer items-center justify-center gap-1 rounded-full border border-foreground/15 bg-surface/50 px-2 py-1.5 text-sm leading-none transition outline-none hover:bg-surface focus-visible:bg-surface",
          className,
        )}
        title={`${t("search.title")} (Ctrl+K)`}
        {...props}
      >
        <span className="i-f7:search text-foreground/75 text-base -m-0.5" />
        <span>{t("search.title")}</span>
      </Command.Trigger>
      <Command.Popup
        title={t("search.title")}
        description={t("search.description")}
        initialFocus={inputRef}
      >
        <div className="flex items-center justify-center border-b border-foreground/15 px-3 py-2">
          <Command.Input
            value={query}
            ref={inputRef}
            onInput={(e) => setQuery(e.currentTarget.value)}
            placeholder={t("search.input.placeholder")}
            className={cx("ps-10", query && "pe-10")}
            before={
              <span className="i-f7:search absolute left-2 shrink-0 text-2xl text-current/50" />
            }
            after={
              query && (
                <button
                  type="button"
                  className="absolute right-0 flex size-9 cursor-pointer items-center justify-center text-current/50 hover:text-current/75 focus-visible:text-current/75 active:text-current"
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

          <Command.Close className="flex cursor-pointer items-center px-3 py-1.5 no-underline text-current/75 transition-opacity focus-visible:text-current hover:text-current sm:hidden -me-1 -mt-0.5">
            {t("search.footer.exit")}
          </Command.Close>
        </div>

        <Command.List>
          <Command.Empty className="flex-col items-center justify-center p-0! gap-2">
            <span className="i-f7:skew text-2xl text-current/75" />
            <span className="mt-0.5">{t("search.empty")}</span>
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
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>

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
      </Command.Popup>
    </Command.Root>
  );
}
