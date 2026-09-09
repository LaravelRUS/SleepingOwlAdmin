const COLOR_FUNCTIONS = [
    'color',
    'hsl',
    'hsla',
    'hwb',
    'lab',
    'lch',
    'oklab',
    'oklch',
    'rgb',
    'rgba',
]

const COLOR_LITERAL_RULES = {
    'color-named': 'never',
    'color-no-hex': true,
    'function-disallowed-list': COLOR_FUNCTIONS,
}

export default {
    extends: ['stylelint-config-standard-scss'],
    ignoreFiles: [
        'public/**',
        'resources/archive/**',
        'resources/css/themes/adminlte/legacy/**',
        'vendor/**',
    ],
    overrides: [
        {
            files: ['**/_colors.scss', '**/_variables.scss', '**/_tokens.scss'],
            rules: {
                'color-named': null,
                'color-no-hex': null,
                'function-disallowed-list': null,
            },
        },
    ],
    plugins: ['stylelint-scss'],
    rules: COLOR_LITERAL_RULES,
}
