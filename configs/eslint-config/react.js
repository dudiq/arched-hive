module.exports = {
  extends: ['./typescript.js', 'plugin:react/recommended'],
  plugins: ['react'],
  settings: {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    'import/resolver': {
      typescript: {},
    },
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-leaked-render': [1, { "validStrategies": ["coerce"] }],
    camelcase: 'error',
    'spaced-comment': 'error',
    quotes: ['error', 'single'],
  },
  overrides: [
    {
      files: ['*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
}
