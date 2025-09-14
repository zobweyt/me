import {
  CommandDialog,
  CommandDialogContent,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/Command";
import { DialogClose, DialogTrigger } from "./Dialog";
import { LOCALES, useTranslations } from "@i18n";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@lib/cn";
import type { CollectionEntry } from "astro:content";
import Highlighter from "react-highlight-words";
import { navigate } from "astro:transitions/client";
import { SOCIALS } from "@constants";

const flags = {
  en: "https://emojicdn.elk.sh/🇺🇸?style=apple",
  ru: "https://emojicdn.elk.sh/🇷🇺?style=apple",
};

export default function Search({
  posts,
  projects,
  className,
  url,
  currentLocale,
  ...props
}: {
  posts: CollectionEntry<"blog">[];
  projects: CollectionEntry<"projects">[];
  url: URL;
  currentLocale: string | undefined;
} & React.ComponentProps<typeof DialogTrigger>) {
  const t = useTranslations(currentLocale);
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
      action?: boolean;
      external?: boolean;
    }[];
  }[] = [
    {
      name: t("search.groups.pages.title"),
      items: [
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="shrink-0 opacity-50"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          ),
          name: t("search.groups.pages.items.home"),
          href: `/${currentLocale}`,
        },
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="shrink-0 opacity-50"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          ),
          name: t("search.groups.pages.items.blog"),
          href: `/${currentLocale}/blog`,
        },
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="shrink-0 opacity-50"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="shrink-0 opacity-50"
          >
            <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
            <path d="M15 3v4a2 2 0 0 0 2 2h4" />
          </svg>
        ),
        name: post.data.title,
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
            width={24}
            height={24}
            className="shrink-0 rounded-full shadow ring ring-black/15"
          />
        ),
        name: project.data.title,
        href: project.data.repo ?? "#",
        external: true,
      })),
    },
    {
      name: t("search.groups.socials.title"),
      items: [
        ...SOCIALS.map((social) => ({
          icon: (
            <div
              className="size-6 shrink-0 rounded-full bg-(--icon-color)/75 shadow ring ring-black/15"
              style={{ "--icon-color": social.color } as React.CSSProperties}
            />
          ),
          name: social.name,
          href: social.href,
          external: true,
        })),
      ],
    },
    {
      name: t("search.groups.locales.title"),
      items: [
        ...LOCALES.map((locale) => ({
          icon: <img src={flags[locale]} alt={locale} width={24} height={24} />,
          name: t(`search.groups.locales.items.${locale}`),
          href: currentLocale != null ? url.pathname.replace(currentLocale, locale) : `/${locale}`,
          action: true,
        })),
      ],
    },
  ];

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={cn(
            "flex w-fit items-center justify-center gap-0.5 rounded-full border border-black/15 px-2 py-1 text-xs leading-none transition outline-none hover:bg-black/5 focus-visible:bg-black/5",
            className,
          )}
          {...props}
        >
          <svg
            data-hk="s200002000001"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4 text-black/75 md:-ml-0.5"
          >
            <path
              fill-rule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Ctrl K</span>
        </DialogTrigger>
        <CommandDialogContent title={t("search.title")} description={t("search.description")}>
          <div className="m-2 flex items-center justify-center gap-2">
            <CommandInput
              value={query}
              ref={inputRef}
              onInput={(e) => setQuery(e.currentTarget.value)}
              placeholder={t("search.input.placeholder")}
              className={query && "pe-10"}
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="size-5 stroke-current"
                      strokeWidth={2.5}
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                )
              }
            />

            {!query && (
              <DialogClose className="flex items-center gap-1 px-2 py-1.5 no-underline opacity-75 transition-opacity hover:opacity-100 sm:hidden">
                {t("search.footer.exit")}
              </DialogClose>
            )}
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
                ↑/↓
              </kbd>
              <span>{t("search.footer.prevnext")}</span>
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
