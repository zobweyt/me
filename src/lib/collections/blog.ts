import { type CollectionEntry, getCollection } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export type GetBlogPostsProps = {
  count?: number | undefined;
  locale?: string | undefined;
};

export const getBlogPosts = async (props?: GetBlogPostsProps) => {
  const blog = await getCollection("blog");

  const entries = (
    props?.locale != null
      ? blog.filter((entry) => entry.id.split("/")[0] === props.locale)
      : blog
  ).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return props?.count !== undefined ? entries.slice(0, props.count) : entries;
};

export const getBlogPostsByYears = async (props?: GetBlogPostsProps) => {
  const data = await getBlogPosts(props);

  type Acc = {
    [year: string]: BlogPost[];
  };

  const posts = data.reduce((acc: Acc, post) => {
    const year = post.data.date.getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(posts).sort(
    (a, b) => parseInt(b, 10) - parseInt(a, 10),
  );
  return { posts, years };
};
