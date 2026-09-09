import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('ships executable tooltip behavior in the shared feature runtime without jQuery', () => {
    const entry = readFileSync(
        resolve(root, 'public/default/profiles/production/js/shared/features.js'),
        'utf8',
    )

    expect(entry.length).toBeGreaterThan(1000)
    expect(entry).toContain('data-toggle')

    const sources = [
        'browser.js',
        'install-tooltips.js',
        'tooltip-elements.js',
        'tooltip-position.js',
        'tooltip-template.js',
        'tooltips.js',
    ]
        .map((file) => read(`resources/js/shared/features/tooltip/${file}`))
        .join('\n')
    expect(sources).not.toMatch(/(?:\$|jQuery)\s*\(/)
})

it('keeps the legacy trigger and renders the normal popup from a Blade template', () => {
    const base = read('resources/views/themes/adminlte/default/_layout/base.blade.php')
    const partial = read('resources/views/themes/adminlte/default/_partials/tooltip.blade.php')
    const elements = read('resources/js/shared/features/tooltip/tooltip-elements.js')
    const runtime = read('resources/js/shared/features/tooltip/tooltips.js')
    const template = read('resources/js/shared/features/tooltip/tooltip-template.js')

    expect(base).toContain('_partials.tooltip')
    expect(partial).toContain('data-tooltip-template')
    expect(partial).toContain('data-tooltip-popup')
    expect(partial).toContain('data-tooltip-content')
    expect(elements).toContain('[data-toggle="tooltip"]')
    expect(runtime).not.toContain('createElement(')
    expect(template).toContain("document.createElement('div')")
    expect(`${base}\n${partial}\n${elements}`).not.toContain('data-tooltip="')
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}
