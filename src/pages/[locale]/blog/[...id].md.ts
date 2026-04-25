import { type BlogPost, getBlogPosts } from "@/lib/collections/blog";

export const prerender = true;

interface Context {
  props: {
    post: BlogPost;
  };
}

export async function getStaticPaths() {
  const posts = await getBlogPosts();

  return posts.map((post) => {
    const [locale, id] = post.id.split("/");

    return {
      params: { locale, id },
      props: { post },
    };
  });
}

export async function GET({ props: { post } }: Context) {
  const content = `# ${post.data.title}\n\n${post.data.description}\n\n${post.body}`;

  return new Response(content, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
