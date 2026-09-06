import js from '@eslint/js'

const modernJavaScript = [
    'resources/frontend/**/*.js',
    'tests/frontend/**/*.js',
    'tests/frontend/**/*.mjs',
    'scripts/modernization/build-asset-profiles.mjs',
    'playwright.config.mjs',
    'stylelint.config.mjs',
    'vitest.config.mjs',
]

const legacyFirstPartyJavaScript = [
    'resources/assets/js_owl/*.js',
    'resources/assets/js_owl/admin/**/*.js',
    'resources/assets/js_owl/components/**/*.js',
    'resources/assets/js_owl/wysiwyg/**/*.js',
]

const legacyRuntimeGlobals = {
    $: 'readonly',
    _: 'readonly',
    Admin: 'readonly',
    atob: 'readonly',
    axios: 'readonly',
    CKEDITOR: 'readonly',
    ClassicEditor: 'readonly',
    console: 'readonly',
    Cookies: 'readonly',
    document: 'readonly',
    File: 'readonly',
    FileReader: 'readonly',
    FormData: 'readonly',
    globalThis: 'readonly',
    Image: 'readonly',
    jQuery: 'readonly',
    lazyload: 'readonly',
    localStorage: 'readonly',
    location: 'readonly',
    module: 'readonly',
    require: 'readonly',
    setInterval: 'readonly',
    setTimeout: 'readonly',
    SimpleMDE: 'readonly',
    Swal: 'readonly',
    tinymce: 'readonly',
    trans: 'readonly',
    URL: 'readonly',
    URLSearchParams: 'readonly',
    Vue: 'readonly',
    window: 'readonly',
}

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
    {
        files: ['resources/frontend/features/**/*.js'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['**/themes/**'],
                            message:
                                'Frontend features cannot import concrete theme implementations.',
                        },
                    ],
                },
            ],
        },
    },
    {
        files: legacyFirstPartyJavaScript,
        languageOptions: {
            ecmaVersion: 'latest',
            globals: legacyRuntimeGlobals,
            sourceType: 'module',
        },
        rules: {
            'no-global-assign': 'error',
            'no-implicit-globals': ['error', { lexicalBindings: true }],
            'no-undef': 'error',
        },
    },
]
