import { Tabs } from "@base-ui/react/tabs";
import { cx } from "class-variance-authority";
import { useMemo, useState } from "react";
import SKILL_CATEGORIES from "@/content/skills/categories";
import SKILL_GROUPS from "@/content/skills/groups";
import type { Skill, SkillCategory } from "@/lib/collections/skills";
import { getTranslator } from "@/lib/i18n";

export default function Skills({
  skills,
  currentLocale,
}: {
  skills: Skill[];
  currentLocale: string | undefined;
}) {
  const t = getTranslator(currentLocale);
  const [selectedCategory, setSelectedCategory] =
    useState<SkillCategory>("primary");
  const [focusSource, setFocusSource] = useState<"mouse" | null>(null);

  const groupedSkills = useMemo(() => {
    const isArchiveCategory = selectedCategory === "archive";
    const isGlobalCategory =
      selectedCategory === "primary" || isArchiveCategory;

    if (isGlobalCategory) {
      const groups: Record<string, typeof skills> = {};

      SKILL_CATEGORIES.forEach((category) => {
        if (category === "primary" || category === "archive") return;

        const skillsInCategory = skills.filter((s) => {
          const hasSelected = s.data.categories.includes(selectedCategory);
          const hasCurrentCategory = s.data.categories.includes(category);
          const isHiddenArchive =
            !isArchiveCategory && s.data.categories.includes("archive");
          return hasSelected && hasCurrentCategory && !isHiddenArchive;
        });

        if (skillsInCategory.length > 0) {
          groups[t(`skills.category.${category}`)] = skillsInCategory;
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

    SKILL_GROUPS.forEach((groupKey) => {
      const skillsInGroup = filtered.filter((s) => s.data.group === groupKey);
      if (skillsInGroup.length > 0) {
        orderedGroups[t(`skills.group.${groupKey}`)] = skillsInGroup;
      }
    });

    return orderedGroups;
  }, [skills, selectedCategory, t]);

  return (
    <Tabs.Root value={selectedCategory} onValueChange={setSelectedCategory}>
      <Tabs.List className="relative z-0 flex gap-1.5 overflow-x-auto [scrollbar-width:none] max-sm:-mx-4 max-sm:px-4 scroll-smooth">
        {SKILL_CATEGORIES.map((category) => (
          <Tabs.Tab
            key={category}
            value={category}
            onMouseDown={() => setFocusSource("mouse")}
            onFocus={(event) => {
              if (focusSource !== "mouse") {
                event.currentTarget.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                  inline: "center",
                });
              }
              setFocusSource(null);
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
            {t(`skills.category.${category}`)}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <Tabs.Panel
        key={selectedCategory}
        value={selectedCategory}
        tabIndex={-1}
        className="grid grid-cols-2 gap-4 mt-4"
      >
        {Object.entries(groupedSkills).map(([groupName, skills]) => (
          <section key={groupName}>
            <h3 className="text-xs font-medium uppercase tracking-wider text-current/50 mb-1.5">
              {groupName}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {skills?.map((skill) => (
                <li key={skill.id}>
                  <a
                    title={skill.data.name}
                    className={cx(
                      "flex size-8! focus-visible:scale-110 @hover:scale-110 active:opacity-75 motion-safe:transition outline-none",
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
