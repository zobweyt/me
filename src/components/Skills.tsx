import { Tabs } from "@base-ui/react/tabs";
import { cx } from "class-variance-authority";
import { useMemo, useState } from "react";
import { getTranslator } from "@/lib/i18n";
import { SKILLS, SKILL_CATEGORIES, type SkillCategory } from "@/lib/skills";

export default function Skills({
  currentLocale,
}: {
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
      const groups: Record<string, typeof SKILLS> = {};

      SKILL_CATEGORIES.forEach((category) => {
        if (category === "primary" || category === "archive") return;

        const skillsInCategory = SKILLS.filter((skill) => {
          const hasSelected = skill.categories.includes(selectedCategory);
          const hasCurrentLoopCategory = skill.categories.includes(category);
          const isHiddenArchive =
            !isArchiveCategory && skill.categories.includes("archive");

          return hasSelected && hasCurrentLoopCategory && !isHiddenArchive;
        });

        if (skillsInCategory.length > 0) {
          groups[t(`skills.category.${category}`)] = skillsInCategory;
        }
      });

      return groups;
    }

    const filtered = SKILLS.filter(
      (skill) =>
        skill.categories.includes(selectedCategory) &&
        !skill.categories.includes("archive"),
    );

    return Object.groupBy(filtered, (skill) =>
      t(`skills.group.${skill.group}`),
    );
  }, [selectedCategory, t]);

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
            className="flex items-center text-sm justify-center px-2.5 py-1 font-medium text-foreground/75 bg-surface @hover:(text-foreground bg-foreground/10) active:bg-foreground/15 hover:active:bg-foreground/15 rounded-full outline-hidden select-none focus-visible:ring-foreground ring ring-inset ring-transparent motion-safe:transition data-[active]:focus-visible:opacity-75 data-[active]:(text-body! bg-foreground!)"
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
                  <span
                    title={skill.name}
                    className={cx("flex size-8!", skill.icon)}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Tabs.Panel>
    </Tabs.Root>
  );
}
