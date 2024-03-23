const { resolve } = require("node:path");

const baseRules = require('./rules/base')
const typescriptRules = require('./rules/typescript')
const { getRestrictedRules } = require('./utils/getRestrictedRules')

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    './base.js',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project,
  },
  settings: {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },

  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        ...typescriptRules,

        // control the usage of eslint-disable comments
        'eslint-comments/no-restricted-disable': [
          'warn',
          ...getRestrictedRules(typescriptRules, getRestrictedRules(baseRules)),
        ],
      },
    },
  ],
}
