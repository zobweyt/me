import { GITHUB_TOKEN } from "astro:env/server";

export const fetchGitHubGraphQL = async (query: string) => {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });

  const json = await response.json();

  if (json.errors) {
    console.error("GitHub GraphQL errors:", json.errors);
    return null;
  }

  return json.data;
};
