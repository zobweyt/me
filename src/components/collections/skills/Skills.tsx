import { ScrollArea } from "@base-ui/react/scroll-area";
import { Tabs } from "@base-ui/react/tabs";
import { cx } from "class-variance-authority";
import { useMemo, useState } from "react";
import SKILLS_CATEGORIES from "@/content/skills/categories.json";
import SKILLS_GROUPS from "@/content/skills/groups.json";
import type { Skill } from "@/lib/collections/skills";

export default function Skills({
  skills,
  locale,
}: {
  skills: Skill[];
  locale: string | undefined;
}) {
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
      <Tabs.List render={<ScrollArea.Root />} className="px-4 md:px-8">
        <ScrollArea.Viewport
          className={cx(
            "[--mask-start:black] data-[overflow-x-start]:[--mask-start:transparent]",
            "[--mask-end:black] data-[overflow-x-end]:[--mask-end:transparent]",
            "[mask-image:linear-gradient(to_right,var(--mask-start)_0%,black_15%,black_85%,var(--mask-end)_100%)]",
          )}
          tabIndex={-1}
        >
          <ScrollArea.Content className="flex gap-1.5">
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
                  event.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }}
                className="flex cursor-pointer items-center text-sm justify-center px-2.5 py-1 font-medium text-foreground/75 bg-surface @hover:(text-foreground bg-foreground/10) active:bg-foreground/15 hover:active:bg-foreground/15 rounded-full outline-hidden select-none focus-visible:ring-foreground ring ring-inset ring-transparent motion-safe:transition data-[active]:focus-visible:opacity-75 data-[active]:(text-body! bg-foreground!)"
              >
                {category.i18n[locale as keyof typeof category.i18n].name}
              </Tabs.Tab>
            ))}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </Tabs.List>
      <Tabs.Panel
        key={selectedCategory}
        value={selectedCategory}
        tabIndex={-1}
        className="grid grid-cols-2 mt-4"
      >
        {entries.map(([group, skills], index) => (
          <section
            key={group}
            className={cx(
              "p-4 sm:px-4 md:px-8 border-t border-foreground/5",
              index % 2 !== 0 && "border-l",
            )}
          >
            <h3 className="text-xs font-medium uppercase tracking-wider text-current/50 mb-1.5">
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
    </Tabs.Root>
  );
}
