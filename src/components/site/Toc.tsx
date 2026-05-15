import { Menu } from "@base-ui/react";
import { cva, cx } from "class-variance-authority";
import { Link } from "../ui";
import { useToc } from "./useToc";

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface TocProps extends React.ComponentPropsWithoutRef<"nav"> {
  headings: Heading[];
  translations?: { toc: string };
  variant?: "desktop" | "mobile";
}

const linkStyles = cva("", {
  variants: {
    depth: {
      1: "2xl:ps-0 gap-2.5",
      2: "2xl:ps-0 gap-2.5",
      3: "2xl:ps-2.5 gap-6.5",
      4: "2xl:ps-4.5 gap-10.5",
      5: "2xl:ps-6.5 gap-12.5",
      6: "2xl:ps-8.5 gap-14.5",
    },
    variant: {
      mobile: "",
    },
  },
});

export default function Toc({
  headings = [],
  translations,
  className,
  variant = "mobile",
  ...props
}: TocProps) {
  const { text, slug, progress } = useToc(headings);

  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  if (variant === "desktop") {
    return (
      <nav
        className={cx(
          "max-2xl:hidden 2xl:sticky 2xl:top-14 2xl:p-8 2xl:bg-transparent 2xl:m-0 2xl:z-auto",
          className,
        )}
        {...props}
      >
        <h2 className="text-sm font-serif font-medium mb-1.5">
          {translations?.toc}
        </h2>
        <ul id="toc" className="2xl:overflow-y-auto space-y-1">
          {headings.map((heading) => (
            <li
              key={heading.slug}
              className={linkStyles({
                depth: heading.depth as 1 | 2 | 3 | 4 | 5 | 6,
                className:
                  "py-0.5 block text-sm transition-colors outline-none",
              })}
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
        "2xl:hidden -mx-4 -mt-4 lg:-mx-8 sm:-mt-8 sticky top-14 bg-body mb-4 z-1",
        className,
      )}
      {...props}
    >
      <Menu.Root>
        <Menu.Trigger className="flex cursor-pointer items-center border-b border-foreground/5 justify-between w-full py-3 text-sm font-medium px-4 lg:px-8 @hover:bg-surface/25 focus-visible:bg-surface/25 active:bg-surface/30! motion-safe:transition outline-none">
          <div className="flex items-center gap-2 overflow-hidden pr-4 min-w-0 w-full">
            <svg
              className="w-5 h-5 transform -rotate-90 shrink-0"
              viewBox="0 0 24 24"
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
                className="text-current/50 transition-[stroke-dashoffset] duration-300 ease-out"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="12"
                cy="12"
              />
            </svg>
            {text ? (
              <span className="truncate">{text}</span>
            ) : (
              <span className="text-current/75">{translations?.toc}</span>
            )}
          </div>
          <span className="i-f7:chevron-down text-current/50 ms-4 text-lg motion-safe:transition-transform shrink-0 menu-open:rotate-180" />
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Positioner
            align="center"
            className="sticky border-b border-foreground/5 z-10"
          >
            <Menu.Popup
              id="toc"
              className="bg-body outline-none w-[var(--anchor-width)] max-h-[calc(100dvh-6.25rem)] flex divide-y divide-foreground/5 overflow-y-auto flex grow flex-col"
            >
              {headings.map((heading) => (
                <Menu.LinkItem
                  key={heading.slug}
                  href={`#${heading.slug}`}
                  className={linkStyles({
                    depth: heading.depth as 1 | 2 | 3 | 4 | 5 | 6,
                    className: cx(
                      "py-2.5 px-4 text-sm flex items-center lg:px-8 @hover:bg-surface/25 focus-visible:bg-surface/25 active:bg-surface/30! motion-safe:transition outline-none",
                      slug === heading.slug && "bg-surface/20",
                    ),
                  })}
                  closeOnClick
                >
                  <span className="i-f7:text-alignleft shrink-0 text-lg text-current/50" />
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
