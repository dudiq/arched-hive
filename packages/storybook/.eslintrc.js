/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@repo/eslint-config/react.js'],
  ignorePatterns: ['copy-css.mjs', 'dist'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
}
