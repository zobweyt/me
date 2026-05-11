import { ScrollArea } from "@base-ui/react/scroll-area";
import { Tabs } from "@base-ui/react/tabs";
import { cx } from "class-variance-authority";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import SKILLS_CATEGORIES from "@/content/skills/categories.json";
import SKILLS_GROUPS from "@/content/skills/groups.json";
import type { Skill } from "@/lib/collections/skills";

export const useAutoResize = ({
  property = "height",
}: {
  property?: "height" | "width" | "both";
}) => {
  // ref can be attached to any HTML element
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");
  const [width, setWidth] = useState<number | "auto">("auto");

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const observedHeight = entries[0].contentRect.height;
        const observedWidth = entries[0].contentRect.width;
        setHeight(observedHeight);
        setWidth(observedWidth);
      });

      resizeObserver.observe(ref.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  const heightValue = property === "height" ? height : "auto";
  const widthValue = property === "width" ? width : "auto";

  return {
    ref,
    height: heightValue,
    width: widthValue,
  };
};

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(QUERY).matches : false,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const handleChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);

    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

export const AutoResize = ({
  children,
  overflow = false,
  duration = 400,
  className,
  property = "height",
}: {
  children: React.ReactNode;
  overflow?: boolean;
  duration?: number;
  className?: string;
  property?: "height" | "width" | "both";
}) => {
  const { ref, width, height } = useAutoResize({
    property,
  });
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const transitionProperty = property === "both" ? "height, width" : property;
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      style={{
        height,
        width,
        overflow: overflow ? "visible" : "hidden",
        transitionDuration: mounted
          ? prefersReducedMotion
            ? "0ms"
            : `${duration}ms`
          : "0ms",
        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
        transitionProperty,
      }}
      className={className}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
};

export default function Skills({
  skills,
  locale,
}: {
  skills: Skill[];
  locale: string | undefined;
}) {
  const haptics = useWebHaptics();
  const [selectedCategory, setSelectedCategory] = useState(
    SKILLS_CATEGORIES[0].id,
  );
  const [tabFocusSource, setTabFocusSource] = useState<"mouse" | null>(null);

  const groupedSkills = useMemo(() => {
    const isArchiveCategory = selectedCategory === "archive";
    const isGlobalCategory =
      selectedCategory === "primary" || isArchiveCategory;

    if (isGlobalCategory) {
      const groups: Record<string, typeof skills> = {};

      SKILLS_CATEGORIES.forEach((category) => {
        if (category.id === "primary" || category.id === "archive") return;

        const skillsInCategory = skills.filter((skill) => {
          const hasSelected = skill.data.categories.includes(selectedCategory);
          const hasCurrentCategory = skill.data.categories.includes(
            category.id,
          );
          const isHiddenArchive =
            !isArchiveCategory && skill.data.categories.includes("archive");
          return hasSelected && hasCurrentCategory && !isHiddenArchive;
        });

        if (skillsInCategory.length > 0) {
          groups[category.i18n[locale as keyof typeof category.i18n].name] =
            skillsInCategory;
        }
      });

      return groups;
    }

    const filtered = skills.filter(
      (skill) =>
        skill.data.categories.includes(selectedCategory) &&
        !skill.data.categories.includes("archive"),
    );

    const orderedGroups: Record<string, typeof skills> = {};

    SKILLS_GROUPS.forEach((group) => {
      const skillsInGroup = filtered.filter(
        (skill) => skill.data.group === group.id,
      );
      if (skillsInGroup.length > 0) {
        orderedGroups[group.i18n[locale as keyof typeof group.i18n].name] =
          skillsInGroup;
      }
    });

    return orderedGroups;
  }, [skills, locale, selectedCategory]);

  const entries = useMemo(() => {
    const entries = Object.entries(groupedSkills);

    if (entries.length % 2 !== 0) {
      entries.push(["", []]);
    }

    return entries;
  }, [groupedSkills]);

  return (
    <Tabs.Root value={selectedCategory} onValueChange={setSelectedCategory}>
      <Tabs.List render={<ScrollArea.Root />} className="px-4 lg:px-8">
        <ScrollArea.Viewport
          className="px-4 -mx-4 lg:px-8 lg:-mx-8 py-2 md:py-3"
          tabIndex={-1}
        >
          <ScrollArea.Content className="flex gap-1.5 py-2 -my-2 px-4 -mx-4">
            {SKILLS_CATEGORIES.map((category) => (
              <Tabs.Tab
                key={category.id}
                value={category.id}
                onMouseDown={() => setTabFocusSource("mouse")}
                onFocus={(event) => {
                  if (tabFocusSource !== "mouse") {
                    event.currentTarget.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                      inline: "center",
                    });
                  }
                  setTabFocusSource(null);
                }}
                onClick={(event) => {
                  haptics.trigger("selection");
                  event.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }}
                className="flex cursor-pointer items-center text-sm justify-center px-2.5 py-1 font-medium text-foreground/75 bg-surface @hover:(text-foreground bg-foreground/10) active:(text-foreground bg-foreground/15 translate-y-px scale-[0.99]) hover:active:(text-foreground bg-foreground/15 translate-y-px scale-[0.99]) rounded-full select-none focus-visible:(outline-2 outline-offset-2 outline-selection) motion-safe:transition data-[active]:(text-body! bg-foreground!)"
              >
                {category.i18n[locale as keyof typeof category.i18n].name}
              </Tabs.Tab>
            ))}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </Tabs.List>
      <AutoResize>
        <Tabs.Panel
          key={selectedCategory}
          value={selectedCategory}
          tabIndex={-1}
          className="grid grid-cols-2"
        >
          {entries.map(([group, skills], index) => (
            <section
              key={group}
              className={cx(
                "p-4 sm:px-4 lg:px-8 border-t border-foreground/5",
                index % 2 !== 0 && "border-l",
              )}
            >
              <h3 className="text-xs font-mono light:font-medium uppercase tracking-widest text-current/50 mb-1.5">
                {group}
              </h3>
              <ul className="flex flex-wrap gap-2 max-sm:gap-1">
                {skills?.map((skill) => (
                  <li key={skill.id}>
                    <a
                      title={skill.data.name}
                      className={cx(
                        "flex size-7! focus-visible:scale-110 @hover:scale-110 active:opacity-75 motion-safe:transition outline-none",
                        skill.data.icon,
                      )}
                      rel="noopener noreferrer"
                      target="_blank"
                      href={skill.data.href}
                    >
                      <span className="sr-only">{skill.data.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </Tabs.Panel>
      </AutoResize>
    </Tabs.Root>
  );
}
