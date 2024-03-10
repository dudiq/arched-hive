module.exports = {
  plugins: ['filenames', 'unicorn'],
  rules: {
    'unicorn/prefer-switch': 'error',
    'unicorn/no-nested-ternary': 'error',
    'unicorn/no-keyword-prefix': 'warn',
    'unicorn/no-lonely-if': 'error',
    'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    'unicorn/expiring-todo-comments': 'error',

    'filenames/match-regex': ['error', '^(?!constant|type).*', true],
    'max-lines': ['error', 280],
  },
}
