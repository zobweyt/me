import { Menu } from "@base-ui/react";
import { cx } from "class-variance-authority";
import { useState } from "react";
import { TextMorph } from "torph/react";
import { Link } from "../ui";
import { useToc } from "./useToc";

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface TocProps extends React.ComponentPropsWithoutRef<"nav"> {
  headings: Heading[];
  translations: { toc: string };
  variant?: "desktop" | "mobile";
}

export default function Toc({
  headings = [],
  translations,
  className,
  variant = "mobile",
  ...props
}: TocProps) {
  const [open, setOpen] = useState(false);
  const { text, slug } = useToc(headings);

  const radius = 9;
  const circumference = 2 * Math.PI * radius;

  if (variant === "desktop") {
    return (
      <nav
        className={cx(
          "max-2xl:hidden 2xl:sticky 2xl:top-14 2xl:p-8 2xl:bg-transparent 2xl:m-0 2xl:z-auto",
          className,
        )}
        {...props}
      >
        <h2 className="font-serif font-medium mb-1.5">{translations?.toc}</h2>
        <ul className="2xl:overflow-y-auto space-y-1">
          {headings.map((heading) => (
            <li
              key={heading.slug}
              className={cx(
                "py-0.5 block transition-colors outline-none",
                heading.depth === 3 && "ps-2.5",
                heading.depth === 4 && "ps-4.5",
                heading.depth === 5 && "ps-6.5",
                heading.depth === 6 && "ps-8.5",
              )}
            >
              <Link
                href={`#${heading.slug}`}
                data-current={slug === heading.slug ? "true" : undefined}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav
      className={cx(
        "2xl:hidden -mx-4 -mt-4 lg:-mx-8 z-1 sm:-mt-8 sticky top-14 bg-body mb-4",
        className,
      )}
      {...props}
    >
      <Menu.Root open={open} onOpenChange={setOpen}>
        <Menu.Trigger className="group flex cursor-pointer items-center border-b border-foreground/5 justify-between w-full py-3 text-sm font-medium px-4 lg:px-8 @hover:bg-surface/25 focus-visible:bg-surface/25 active:bg-surface/30! motion-safe:transition outline-none truncate">
          <div className="flex items-center gap-2 overflow-hidden pr-4 min-w-0 w-full">
            <svg
              className="w-5 h-5 transform -rotate-90 shrink-0"
              viewBox="0 0 24 24"
              style={
                { "--circumference": circumference } as React.CSSProperties
              }
            >
              <circle
                className="text-foreground/10"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="12"
                cy="12"
              />
              <circle
                className="text-current/50 svg-scroll-progress"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="12"
                cy="12"
              />
            </svg>
            <TextMorph className={cx(text && !open ? "" : "text-current/75")}>
              {text && !open ? text : translations.toc}
            </TextMorph>
          </div>
          <span className="i-f7:chevron-down text-current/50 ms-4 text-lg motion-safe:transition-transform shrink-0 group-data-[popup-open]:rotate-180" />
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup className="bg-body outline-none w-[var(--anchor-width)] max-h-[calc(100dvh-6.25rem)] flex overflow-y-auto flex grow flex-col origin-[var(--transform-origin)] motion-safe:transition-all data-[ending-style]:scale-y-0 data-[ending-style]:opacity-0 data-[starting-style]:scale-y-0 data-[starting-style]:opacity-0 shadow">
              {headings.map((heading) => (
                <Menu.LinkItem
                  key={heading.slug}
                  href={`#${heading.slug}`}
                  className={cx(
                    "border-b border-foreground/5 py-2.5 px-4 text-sm flex items-center lg:px-8 @hover:bg-surface/25 focus-visible:bg-surface/25 active:bg-surface/30! motion-safe:transition outline-none",
                    slug === heading.slug &&
                      "bg-selection/25! @hover:bg-selection/30! focus-visible:bg-selection/30! active:bg-selection/35!",
                    heading.depth === 3 && "ps-8 lg:ps-12",
                    heading.depth === 4 && "ps-12 lg:ps-16",
                    heading.depth === 5 && "ps-16 lg:ps-20",
                    heading.depth === 6 && "ps-20 lg:ps-24",
                  )}
                  closeOnClick
                >
                  {heading.text}
                </Menu.LinkItem>
              ))}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </nav>
  );
}
