import type { CollectionEntry } from "astro:content";
import { navigate } from "astro:transitions/client";
import React, { useEffect, useRef, useState } from "react";
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
import { LOCALES, getTranslator, type Locale } from "@/i18n";
import { cn } from "@/lib/cn";

import { DialogClose, DialogTrigger } from "./Dialog";

const LOCALES_FLAGS: Record<Locale, string> = {
  en: "https://emojicdn.elk.sh/🇺🇸?style=apple",
  ru: "https://emojicdn.elk.sh/🇷🇺?style=apple",
};

const SOCIALS_ICONS: Record<Social["id"], React.ComponentType<React.ComponentProps<"svg">>> = {
  telegram: IconLogosTelegram,
  github: IconLogosGithubIcon,
  mail: IconLucideMail,
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
      keywords?: string[];
      action?: boolean;
      external?: boolean;
    }[];
  }[] = [
    {
      name: t("search.groups.pages.title"),
      items: [
        {
          icon: <IconLucideArrowRight className="size-6 shrink-0 opacity-50" />,
          name: t("search.groups.pages.items.home"),
          href: `/${currentLocale}`,
        },
        {
          icon: <IconLucideArrowRight className="size-6 shrink-0 opacity-50" />,
          name: t("search.groups.pages.items.blog"),
          href: `/${currentLocale}/blog`,
        },
        {
          icon: <IconLucideArrowRight className="size-6 shrink-0 opacity-50" />,
          name: t("search.groups.pages.items.projects"),
          href: `/${currentLocale}/projects`,
        },
      ],
    },
    {
      name: t("search.groups.blog.title"),
      items: posts.map((post) => ({
        icon: <IconLucideStickyNote className="size-6 shrink-0 opacity-50" />,
        name: post.data.title,
        keywords: [...(post.data.tags ?? []), ...post.data.description.replace(".", "").split(" ")],
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
            className={cn(
              "size-6 shrink-0",
              project.data.logoShape === "circle" && "rounded-full shadow ring ring-black/15",
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
          icon: <IconStreamlineLogosRssFeedLogoBlock className="size-6 shrink-0 text-[#FF6600]" />,
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
      name: t("search.groups.locales.title"),
      items: [
        ...LOCALES.map((locale) => ({
          icon: <img src={LOCALES_FLAGS[locale]} alt={locale} width={24} height={24} />,
          name: t(`search.groups.locales.items.${locale}`),
          href: currentLocale != null ? url.pathname.replace(currentLocale, locale) : `/${locale}`,
          action: true,
          keywords: [locale],
        })),
      ],
    },
  ];

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={cn(
            "flex w-fit items-center justify-center gap-0.5 rounded-full border border-black/15 px-2 py-1 text-sm leading-none transition outline-none hover:bg-black/5 focus-visible:bg-black/5",
            className,
          )}
          title={`${t("search.title")} (Ctrl+K)`}
          {...props}
        >
          <IconLucideSearch className="size-3.5 text-black/75 md:-ml-0.5" />
          <span>{t("search.title")}</span>
        </DialogTrigger>
        <CommandDialogContent title={t("search.title")} description={t("search.description")}>
          <div className="m-2 flex items-center justify-center gap-1">
            <CommandInput
              value={query}
              ref={inputRef}
              onInput={(e) => setQuery(e.currentTarget.value)}
              placeholder={t("search.input.placeholder")}
              className={cn("ps-10", query && "pe-10")}
              before={<IconLucideSearch className="absolute left-2 size-6 shrink-0 opacity-50" />}
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
                    <IconLucideX strokeWidth={3} className="size-5 stroke-current" />
                  </button>
                )
              }
            />

            <DialogClose className="flex items-center gap-1 px-2 py-1.5 no-underline opacity-75 transition-opacity hover:opacity-100 sm:hidden">
              {t("cancel")}
            </DialogClose>
          </div>

          <CommandList>
            <CommandEmpty>{t("search.empty")}</CommandEmpty>

            {groups.map((group) => (
              <CommandGroup key={group.name} heading={group.name}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.href}
                    onSelect={() => {
                      setOpen(false);

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
                      highlightClassName="bg-amber-400 rounded-sm"
                    />
                    {item.action !== true && (
                      <Highlighter
                        autoEscape
                        searchWords={[query]}
                        textToHighlight={item.href}
                        className="min-w-0 truncate opacity-50"
                        highlightClassName="bg-amber-400 rounded-sm"
                      />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>

          <div className="flex gap-4 border-t border-black/10 bg-stone-200 px-4 py-2 text-sm text-black/75 select-none max-sm:hidden">
            <div className="flex items-center gap-2">
              <kbd className="flex min-w-6 justify-center rounded-sm bg-black/5 px-1 py-0.5 text-center font-mono text-xs leading-3.5 ring ring-black/10">
                ↩
              </kbd>
              <span>{t("search.footer.select")}</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="flex min-w-6 justify-center rounded-sm bg-black/5 px-1 py-0.5 text-center font-mono text-xs leading-3.5 ring ring-black/10">
                ↑
              </kbd>
              <span>{t("search.footer.previous")}</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="flex min-w-6 justify-center rounded-sm bg-black/5 px-1 py-0.5 text-center font-mono text-xs leading-3.5 ring ring-black/10">
                ↓
              </kbd>
              <span>{t("search.footer.next")}</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="flex min-w-6 justify-center rounded-sm bg-black/5 px-1 py-0.5 text-center font-mono text-xs leading-3.5 ring ring-black/10">
                esc
              </kbd>
              <span>{t("search.footer.exit")}</span>
            </div>
          </div>
        </CommandDialogContent>
      </CommandDialog>
    </>
  );
}
