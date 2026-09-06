import js from '@eslint/js'

const modernJavaScript = [
  'resources/frontend/**/*.js',
  'tests/frontend/**/*.js',
  'vitest.config.mjs',
]

export default [
  {
    ...js.configs.recommended,
    files: modernJavaScript,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-global-assign': 'error',
      'no-implicit-globals': ['error', { lexicalBindings: true }],
      'no-undef': 'error',
    },
  },
]
