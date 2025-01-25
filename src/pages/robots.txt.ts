import type { APIRoute } from "astro";

const USER_AGENT = "User-agent: *";
const ALLOW = "Allow: /";
const SITEMAP = `Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}`;

const BODY = [USER_AGENT, ALLOW, SITEMAP].join("\n");

export const GET: APIRoute = () => {
  return new Response(BODY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
