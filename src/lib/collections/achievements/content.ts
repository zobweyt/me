import { getCollection } from "astro:content";
import ACHIEVEMENTS_DATA from "@/content/achievements/data.json";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import type { AchievementWithLocalization } from "./types";

export type GetAchievementsProps = {
  locale?: string;
};

export const getAchievements = async ({
  locale,
}: GetAchievementsProps = {}): Promise<AchievementWithLocalization[]> => {
  const achievements = await getCollection("achievements");
  const order = Object.fromEntries(
    ACHIEVEMENTS_DATA.map((achievement, i) => [achievement.id, i]),
  );

  const entries = achievements.map((project) => {
    const { i18n, ...commonData } = project.data;

    const localeData = i18n[locale as keyof typeof i18n];
    const defaultData = i18n[DEFAULT_LOCALE];

    return {
      ...project,
      data: {
        ...commonData,
        title: localeData?.title ?? defaultData?.title ?? "",
        description: localeData?.description ?? defaultData?.description ?? "",
      },
    };
  });

  return entries.sort(
    (a, b) => (order[a.id] ?? Infinity) - (order[b.id] ?? Infinity),
  );
};
