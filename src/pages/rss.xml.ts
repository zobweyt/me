import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { HOME } from "@constants";

type Context = {
  site: string;
};

export async function GET(context: Context) {
  const items = (await getCollection("blog")).sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
  );

  return rss({
    title: HOME.title,
    description: HOME.description,
    site: context.site,
    items: items.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      link: `/${item.collection}/${item.slug}/`,
    })),
  });
}
