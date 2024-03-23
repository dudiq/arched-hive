const { resolve } = require("node:path");

const baseRules = require('./rules/base')
const { getRestrictedRules } = require('./utils/getRestrictedRules')

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'eslint-config-turbo',
    'prettier',
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
  ],
  ignorePatterns: [
    'node_modules',
    'build',
    'dist',
    '.cache',
    '.turbo',
    '.eslintrc.cjs',
    '.eslintrc.js',
    'vitest.config.ts',
  ],
  plugins: [
    'import',
    'security',
    'prettier',
    'max-params-no-constructor',
    'vitest',
    'simple-import-sort',
  ],
  env: {
    jest: true,
    node: true,
    es2021: true,
    browser: true,
  },
  parserOptions: {
    project,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  rules: {
    ...baseRules,

    'max-params': 'off',
    'max-params-no-constructor/max-params-no-constructor': ['error', 5],

    // control the usage of eslint-disable comments
    'eslint-comments/no-restricted-disable': [
      'warn',
      ...getRestrictedRules(baseRules),
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  overrides: [
    {
      files: ['*.config.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['*'],
      parser: '@typescript-eslint/parser',
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            // The default grouping, but with type imports last in each group.
            groups: [
              // Side effect imports.
              ['^\\u0000'],
              // Packages. `react` related packages come first.
              ['^react', '^@?\\w'],
              // Internal packages.
              ['^(@repo|~)?'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // Style imports.
              ['^.+\\.s?css$'],
              // Type imports.
              [
                '^@?\\u0000$',
                '^(@repo|~)?\\u0000$',
                '^[^.].*\\u0000$',
                '^\\..*\\u0000$',
              ],
            ],
          },
        ],
      },
    },
  ],
}
