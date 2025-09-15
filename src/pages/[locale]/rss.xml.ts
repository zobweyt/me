import rss from "@astrojs/rss";

import { getBlogEntries } from "@/content/entries";
import { type Locale, LOCALES, getTranslations } from "@/i18n";

type Context = {
  site: string;
  params: {
    locale: Locale;
  };
};

export const prerender = true;

export async function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { locale } }));
}

export async function GET(context: Context) {
  const { locale } = context.params;

  const t = getTranslations(locale);

  const items = await getBlogEntries({ locale });

  return rss({
    title: t("home.title"),
    description: t("home.description"),
    site: context.site,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: [
      `<language>${locale}</language>`,
      `<atom:link href="${context.site}${locale}/rss.xml" rel="self" type="application/rss+xml" />`,
    ].join(""),
    items: items.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      categories: item.data.tags,
      link: `/${locale}/${item.collection}/${item.slug.replace(`${locale}/`, "")}`,
    })),
  });
}
