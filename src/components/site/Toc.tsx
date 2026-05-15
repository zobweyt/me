import { Collapsible } from "@base-ui/react";
import { cva, cx } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import { Link } from "../ui";

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
  slot?: string;
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
  ...props
}: TocProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [activeSlug, setActiveSlug] = useState("");
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastScrollTime = 0;
    const delay = 150;

    const handleScroll = () => {
      const now = performance.now();

      if (timeoutId) clearTimeout(timeoutId);

      const updateProgress = () => {
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;
        const currentScroll = window.scrollY;
        setProgress(Math.min(Math.max(currentScroll / totalHeight, 0), 1));
        lastScrollTime = now;
      };

      if (now - lastScrollTime >= delay) {
        updateProgress();
      } else {
        timeoutId = setTimeout(updateProgress, delay - (now - lastScrollTime));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const targetElements = document.querySelectorAll(
      "h1, h2[id], h3[id], h4[id], h5[id], h6[id]",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.tagName === "H1") {
              setActiveSlug("");
              setCurrentText("");
            } else {
              const id = entry.target.id;
              setActiveSlug(id);
              const matchingHeading = headings.find((h) => h.slug === id);
              if (matchingHeading) {
                setCurrentText(matchingHeading.text);
              }
            }
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" },
    );

    targetElements.forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <nav
      className={cx(
        "2xl:sticky 2xl:top-14  2xl:p-8  2xl:bg-transparent 2xl:m-0 2xl:z-auto",
        "-mx-4 -mt-4  lg:-mx-8 sm:-mt-8 sticky top-14 bg-body mb-4 z-1",
        className,
      )}
    >
      <div className="max-2xl:hidden">
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
                data-current={activeSlug === heading.slug ? "true" : undefined}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Collapsible.Root
        open={isOpen}
        onOpenChange={setIsOpen}
        ref={containerRef}
        className={cx("left-0 right-0 w-full 2xl:hidden", className)}
        {...props}
      >
        <Collapsible.Trigger
          onClick={() => setIsOpen(!isOpen)}
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
            {currentText && !isOpen ? (
              <span className="truncate">{currentText}</span>
            ) : (
              <span className="text-current/75">{translations?.toc}</span>
            )}
          </div>
          <span
            className={cx(
              "i-f7:chevron-down text-current/50 ms-4 text-lg motion-safe:transition-transform shrink-0",
              isOpen && "rotate-180",
            )}
          />
          <div
            className={cx(
              "absolute [z-index:9999] size-1.5 rotate-45 border border-foreground/5 bg-body -bottom-[2.5px] -left-[3.5px]",
              isOpen && "hidden",
            )}
          />
          <div
            className={cx(
              "absolute [z-index:9999] size-1.5 rotate-45 border border-foreground/5 bg-body -bottom-[2.5px] -right-[3.5px]",
              isOpen && "hidden",
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
                    onClick={() => setIsOpen(false)}
                    data-current={
                      activeSlug === heading.slug ? "true" : undefined
                    }
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
