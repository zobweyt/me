import { ScrollArea } from "@base-ui/react/scroll-area";
import { cx } from "class-variance-authority";
import { useMemo, useState } from "react";
import { Elastic, Tabs } from "@/components/ui";
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
              <Tabs.Tab key={category.id} value={category.id}>
                {category.i18n[locale as keyof typeof category.i18n].name}
              </Tabs.Tab>
            ))}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </Tabs.List>
      <Elastic>
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
      </Elastic>
    </Tabs.Root>
  );
}
