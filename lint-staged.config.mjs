export default {
  "*.{astro,js,jsx,ts,tsx}": (stagedFiles) => [
    `pnpm lint:eslint ${stagedFiles.join(" ")}`,
  ],
  "*.{astro,js,jsx,ts,tsx,css,scss,less,html,json,md}": (stagedFiles) => [
    `pnpm format:prettier:write ${stagedFiles.filter((file) => !file.includes("/public/")).join(" ")}`,
  ],
  "package.json": ["pnpm format:package"],
};
