/** @typedef {import("prettier").Config} PrettierConfig*/

/** @type {PrettierConfig} */
const config = {
  plugins: [import("prettier-plugin-tailwindcss")],
  printWidth: 160,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "auto",
  bracketSameLine: false,
};

export default config;
