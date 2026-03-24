import { getCollection } from "astro:content";

export const getSocials = async () => {
  return await getCollection("socials");
};
