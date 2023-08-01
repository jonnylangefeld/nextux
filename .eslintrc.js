/* eslint-disable jsdoc/require-jsdoc */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs")

module.exports = {
  ignorePatterns: ["**/components/external/supabase/**"],
  extends: [
    "eslint:recommended",
    "plugin:jsdoc/recommended",
    "next",
    "prettier",
    "react-app/jest",
    "plugin:@typescript-eslint/recommended",
    "plugin:tailwindcss/recommended",
  ],
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
  rules: {
    "no-empty": "off",
    "tailwindcss/migration-from-tailwind-2": "off",
    "testing-library/prefer-screen-queries": "off",
    "@next/next/no-html-link-for-pages": "off",
    "jsdoc/require-param-type": "off",
    "jsdoc/require-returns-type": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    "import/order": [
      1,
      {
        groups: ["external", "builtin", "internal", "sibling", "parent", "index"],
        pathGroups: [
          ...getDirectoriesToSort().map((singleDir) => ({
            pattern: `${singleDir}/**`,
            group: "internal",
          })),
          {
            pattern: "env",
            group: "internal",
          },
          {
            pattern: "theme",
            group: "internal",
          },
          {
            pattern: "public/**",
            group: "internal",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["internal"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.tsx"],
      rules: {
        "jsdoc/require-jsdoc": "off",
      },
    },
  ],
}

function getDirectoriesToSort() {
  const ignoredSortingDirectories = [".git", ".next", ".vscode", "node_modules"]
  return getDirectories(process.cwd()).filter((f) => !ignoredSortingDirectories.includes(f))
}

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + "/" + file).isDirectory()
  })
}
