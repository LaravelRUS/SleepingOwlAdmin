import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('runs the real application override fragments against committed asset profiles', () => {
    const browser = normalized(read('tests/frontend/browser/application-blade-overrides.html'))
    const overrides = [
        'tests/Fixtures/application-views/vendor/sleeping_owl/default/_partials/tooltip.blade.php',
        'tests/Fixtures/application-views/vendor/sleeping_owl/default/form/element/image.blade.php',
    ]

    for (const override of overrides) {
        expect(browser).toContain(normalized(read(override)))
    }

    expect(browser).toContain('/public/default/profiles/development/js/admin-core.js')
    expect(browser).toContain('/public/default/profiles/development/js/shared/vue.js')
    expect(browser).not.toMatch(/data-soa-|inline-template|new Vue|vue-template-compiler/)
    expect(browser).not.toMatch(/\b(?:npm|vite|webpack|laravel-mix)\b/i)
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function normalized(value) {
    return value.replace(/\s+/g, ' ').trim()
}
