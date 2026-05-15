import { Collapsible } from "@base-ui/react";
import { cva, cx } from "class-variance-authority";
import { useEffect, useRef } from "react";
import { Link } from "../ui";
import { useToc } from "./useToc";

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface TocProps extends React.ComponentPropsWithoutRef<"nav"> {
  headings: Heading[];
  translations?: {
    toc: string;
  };
  variant?: "desktop" | "mobile";
}

const linkStyles = cva("py-0.5 block text-sm transition-colors", {
  variants: {
    depth: {
      1: "ps-0",
      2: "ps-0",
      3: "ps-2.5",
      4: "ps-4.5",
      5: "ps-6.5",
      6: "ps-8.5",
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
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { open, setOpen, text, slug, progress } = useToc(headings);

  useEffect(() => {
    if (!open || variant !== "mobile") return;

    const frameId = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;

      const activeLink = container.querySelector<HTMLAnchorElement>(
        'a[data-current="true"]',
      );
      const fallbackLink =
        container.querySelector<HTMLAnchorElement>('a[href^="#"]');

      const targetLink = activeLink || fallbackLink;
      targetLink?.focus();
    });

    return () => cancelAnimationFrame(frameId);
  }, [open, variant]);

  useEffect(() => {
    if (!open || variant !== "mobile") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      const isTab = e.key === "Tab";
      const isArrowDown = e.key === "ArrowDown";
      const isArrowUp = e.key === "ArrowUp";

      if (!isTab && !isArrowDown && !isArrowUp) return;

      const container = containerRef.current;
      if (!container) return;

      const trigger = triggerRef.current;
      const links = Array.from(
        container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
      );

      if (!trigger || links.length === 0) return;

      const focusableElements = [trigger, ...links];
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLAnchorElement | HTMLButtonElement,
      );

      if (isTab) {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }

      if (isArrowDown) {
        e.preventDefault();
        if (currentIndex === -1 || document.activeElement === lastElement) {
          firstElement.focus();
        } else {
          focusableElements[currentIndex + 1].focus();
        }
      }

      if (isArrowUp) {
        e.preventDefault();
        if (currentIndex === -1 || document.activeElement === firstElement) {
          lastElement.focus();
        } else {
          focusableElements[currentIndex - 1].focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, variant, setOpen]);

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
        <ul id="toc" className="2xl:overflow-y-auto">
          {headings.map((heading) => (
            <li
              key={heading.slug}
              className={linkStyles({
                depth: heading.depth as 1 | 2 | 3 | 4 | 5 | 6,
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
      <Collapsible.Root
        open={open}
        onOpenChange={setOpen}
        ref={containerRef}
        className="left-0 right-0 w-full"
        {...props}
      >
        <Collapsible.Trigger
          ref={triggerRef}
          onClick={() => setOpen(!open)}
          className="flex cursor-pointer items-center border-b border-foreground/5 justify-between w-full py-3 text-sm font-medium px-4 lg:px-8 @hover:bg-surface/25 focus-visible:bg-surface/25 active:bg-surface/30! motion-safe:transition outline-none"
        >
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
                className="text-current transition-[stroke-dashoffset] duration-300 ease-out"
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
            {text && !open ? (
              <span className="truncate">{text}</span>
            ) : (
              <span className="text-current/75">{translations?.toc}</span>
            )}
          </div>
          <span
            className={cx(
              "i-f7:chevron-down text-current/50 ms-4 text-lg motion-safe:transition-transform shrink-0",
              open && "rotate-180",
            )}
          />
          <div
            className={cx(
              "absolute [z-index:9999] size-1.5 rotate-45 border border-foreground/5 bg-body -bottom-[2.5px] -left-[3.5px]",
              open && "hidden",
            )}
          />
          <div
            className={cx(
              "absolute [z-index:9999] size-1.5 rotate-45 border border-foreground/5 bg-body -bottom-[2.5px] -right-[3.5px]",
              open && "hidden",
            )}
          />
        </Collapsible.Trigger>

        <Collapsible.Panel
          className="sticky bg-body w-full border-b border-foreground/5 z-10 -mb-8"
          tabIndex={-1}
        >
          <div className="px-4 lg:px-8 py-3 h-[calc(100dvh-6.25rem)] overflow-y-auto w-full">
            <div className="absolute [z-index:9999] size-1.5 rotate-45 border border-foreground/5 bg-body -top-[3.5px] -left-[3.5px]" />
            <div className="absolute [z-index:9999] size-1.5 rotate-45 border border-foreground/5 bg-body -top-[3.5px] -right-[3.5px]" />
            <ul id="toc" className="space-y-1">
              {headings.map((heading) => (
                <li
                  key={heading.slug}
                  className={linkStyles({
                    depth: heading.depth as 1 | 2 | 3 | 4 | 5 | 6,
                  })}
                >
                  <Link
                    href={`#${heading.slug}`}
                    data-current={slug === heading.slug ? "true" : undefined}
                    onClick={() => {
                      setOpen(false);
                      requestAnimationFrame(() => {
                        triggerRef.current?.focus();
                      });
                    }}
                  >
                    {heading.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </nav>
  );
}
