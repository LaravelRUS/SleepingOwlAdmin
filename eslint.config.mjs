import js from '@eslint/js'

const modernJavaScript = [
    'resources/frontend/**/*.js',
    'tests/frontend/**/*.js',
    'tests/frontend/**/*.mjs',
    'playwright.config.mjs',
    'stylelint.config.mjs',
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
            complexity: ['error', 8],
            'max-lines-per-function': [
                'error',
                { IIFEs: true, max: 40, skipBlankLines: true, skipComments: true },
            ],
            'max-statements': ['error', 25],
            'no-global-assign': 'error',
            'no-implicit-globals': ['error', { lexicalBindings: true }],
            'no-undef': 'error',
        },
    },
    {
        files: ['resources/frontend/core/**/*.js'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['**/features/**', '**/themes/**'],
                            message:
                                'Frontend core cannot import feature or theme implementations.',
                        },
                    ],
                },
            ],
        },
    },
]
