const isDev = process.env.NODE_ENV === 'development'

// eslint-disable-next-line no-console
console.log('process.env.NODE_ENV', process.env.NODE_ENV)

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'max-params-no-constructor', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'preact',
  ],
  rules: {
    'max-params': 'off',
    'max-params-no-constructor/max-params-no-constructor': ['error', 5],

    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-types': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'no-console': isDev ? 'off' : 'error',
    'no-debugger': isDev ? 'off' : 'error',
    'import/no-cycle': 'error',
    'import/no-anonymous-default-export': 'off',
    'import/no-duplicates': 'warn',
    'import/newline-after-import': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '_' }],
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '~**',
            group: 'parent',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],

    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'typedi',
            message: 'Please use @pv/di instead.',
          },
        ],
      },
    ],

    'react/jsx-tag-spacing': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
}
