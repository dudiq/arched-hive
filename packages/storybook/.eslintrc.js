/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@repo/eslint-config/react.js"],
  ignorePatterns: ['prepare-css.js', 'dist'],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  }
};
