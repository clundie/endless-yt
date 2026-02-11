/**
 * @type {import("lint-staged").Configuration}
 */
export default {
  "*.{css,html,json,jsonc}": ["prettier --write"],
  "*.{js,jsx,mjs,cjs,ts,tsx}": [
    "eslint --fix --no-warn-ignored --max-warnings 0",
    "prettier --write",
  ],
  "*.{ts,tsx}": () => ["npm run typecheck"],
  "package.json": () => ["npx wrangler types --check"],
};
