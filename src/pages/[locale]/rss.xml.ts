import rss from "@astrojs/rss";
import { LOCALES, type Locale, useTranslations } from "@i18n";
import { getBlogEntries } from "@content/entries";

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

  const t = useTranslations(locale);

  const items = await getBlogEntries({ locale });

  return rss({
    title: t("home.title"),
    description: t("home.description"),
    site: context.site,
    items: items.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      link: `/${locale}/${item.collection}/${item.slug.replace(`${locale}/`, "")}`,
    })),
  });
}
