import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  return (wordCount / 200 + 1).toFixed();
}

export function dateRange(startDate: Date, endDate?: Date | "now", locale?: string | undefined): string {
  const startMonth = startDate.toLocaleString(locale, { month: "short" });
  const startYear = startDate.getFullYear().toString();

  if (endDate == null || endDate === "now") {
    return `${startMonth} ${startYear}`;
  } else {
    const endMonth = endDate.toLocaleString("default", { month: "short" });
    const endYear = endDate.getFullYear().toString();
    return `${startMonth} ${startYear} — ${endMonth} ${endYear}`;
  }
}
