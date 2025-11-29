module.exports = {
  env: {
    node: true
  },
  extends: [
    '@nuxtjs'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    indent: ['error', 2, { flatTernaryExpressions: true }],
    'no-unneeded-ternary': ['error', { defaultAssignment: false }],
    'linebreak-style': ['error', 'unix'],
    'no-console': 'warn',
    'no-alert': 'warn',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-const': 'error',
    'quote-props': ['error', 'as-needed'],
    'require-await': 'error'
  }
}
