import type { CollectionEntry } from "astro:content";

export type Achievement = CollectionEntry<"achievements">;

export type AchievementWithLocalization = Omit<Achievement, "data"> & {
  data: Omit<Achievement["data"], "i18n"> & {
    title: string;
    description: string;
  };
};
