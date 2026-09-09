import { describe, expect, it } from 'vitest'
import stylelint from 'stylelint'

import stylelintConfig from '../../../stylelint.config.mjs'

async function lintScss(code, codeFilename) {
    return stylelint.lint({ code, codeFilename, config: stylelintConfig })
}

function ruleNames(result) {
    return result.results[0].warnings.map(({ rule }) => rule)
}

describe('SCSS color literal policy', () => {
    it('rejects color literals in component styles', async () => {
        const result = await lintScss(
            '.button { color: red; background: #fff; border-color: rgb(0 0 0); }',
            'resources/css/core/button.scss',
        )

        expect(ruleNames(result)).toEqual(
            expect.arrayContaining(['color-named', 'color-no-hex', 'function-disallowed-list']),
        )
    })

    it.each(['_colors.scss', '_variables.scss', '_tokens.scss'])(
        'allows centralized literals in %s',
        async (filename) => {
            const result = await lintScss(
                '$text: red !default; $surface: #fff !default; $shadow: rgb(0 0 0) !default;',
                `resources/css/core/${filename}`,
            )

            expect(result.errored).toBe(false)
        },
    )

    it('allows components to consume centralized custom properties', async () => {
        const result = await lintScss(
            `.button {
                color: var(--soa-text-color);
                background: var(--soa-surface-color);
            }`,
            'resources/css/core/button.scss',
        )

        expect(result.errored).toBe(false)
    })
})
